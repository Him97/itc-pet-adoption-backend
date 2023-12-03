const { query } = require('../utils/postgres');
const users = require('../utils/postgres');

const services = {
    clearUser: (user) => {
        delete user.password;
    },
    addUser: async (body, hash) => {
        const newUser = await query(`
            INSERT INTO users (firstname, lastname, email, phone, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `, [body.firstName, body.lastName, body.email, body.phone, hash]);
        return newUser.rows;
    },
    getUsers: async () => {
        const users = await query(`
        SELECT
        users.*,
        ARRAY_AGG(
          DISTINCT jsonb_build_object(
            'id', pets.id,
            'type', pets.type,
            'breed', pets.breed,
            'name', pets.name,
            'adoption_status', pets.adoption_status,
            'taken_by_user_id', pets.taken_by_user_id
          )
        ) AS owned_pets,
        ARRAY_AGG(
          DISTINCT jsonb_build_object(
            'id', pets_users.pet_id,
            'saved', pets_users.saved,
            'name', p_saved.name,
            'type', p_saved.type
          )
        ) AS saved_pets
      FROM
        users
      LEFT JOIN pets ON users.id = pets.taken_by_user_id
      LEFT JOIN pets_users ON users.id = pets_users.user_id
      LEFT JOIN pets p_saved ON pets_users.pet_id = p_saved.id AND pets_users.saved = true
      GROUP BY
        users.id;
            `)
        return users.rows
    },
    getUserById: async (userId) => {
        const user = await query(`
            SELECT * FROM users
            WHERE id = $1
            ORDER BY id ASC
        `, [userId]);
        return user.rows[0];
    },
    getUserByEmail: async (email) => {
        const user = await query(`
            SELECT * FROM users
            WHERE email = $1
        `, [email]);
        return user.rows[0];
    },
    updateUser: async (userId, body) => {
        console.log(Object.keys(body).map(key => `${key}='${body[key]}'`).join(', '))
        await query(
            `UPDATE users
            SET ${Object.keys(body).map(key => `${key}='${body[key]}'`).join(', ')}
            WHERE id = $1`,
            [userId])
    },
    getUserByIdFull: async (userId) => {
      const users = await query(`
      SELECT
      users.*,
      ARRAY_AGG(
        DISTINCT jsonb_build_object(
          'id', pets.id,
          'type', pets.type,
          'breed', pets.breed,
          'name', pets.name,
          'adoption_status', pets.adoption_status,
          'taken_by_user_id', pets.taken_by_user_id
        )
      ) AS owned_pets,
      ARRAY_AGG(
        DISTINCT jsonb_build_object(
          'id', pets_users.pet_id,
          'saved', pets_users.saved,
          'name', p_saved.name,
          'type', p_saved.type
        )
      ) AS saved_pets
    FROM
      users
    LEFT JOIN pets ON users.id = pets.taken_by_user_id
    LEFT JOIN pets_users ON users.id = pets_users.user_id
    LEFT JOIN pets p_saved ON pets_users.pet_id = p_saved.id AND pets_users.saved = true
    GROUP BY
      users.id;
          `,[userId])
      return users.rows
  },
}

module.exports = services;