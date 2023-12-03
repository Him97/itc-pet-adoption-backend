const { query } = require('../utils/postgres');
const pets = require('../utils/postgres');

const services = {
  addPet: async (body) => {
    const newPet = await query(`
            INSERT INTO pets (type, name, adoption_status, height, weight, color, bio, hypoallergenic, dietary_restrictions, breed, picture)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id
        `, [body.type, body.name, body.adoption_status, body.height, body.weight, body.color, body.bio, body.hypoallergenic, body.dietary_restrictions, body.breed, body.picture]);
    return newPet.rows;
  },
  getPetById: async (petId, userId) => {
    if (userId) {
      const pets = await query(`
            SELECT pets.*, pets_users.saved, pets_users.user_id, pets_users.id AS relation_id
            FROM pets
            LEFT JOIN pets_users ON pets.id = pets_users.pet_id AND pets_users.user_id = $2
            WHERE pets.id = $1;
        `, [petId, userId]);
      return pets.rows[0];
    } else {
      const pets = await query(`
      SELECT * FROM pets
      WHERE id = $1
      ORDER BY id ASC
      `, [petId]);
      return pets.rows[0]
    }
  },
  getPetByUser: async (userId) => {
    const pet = await query(`
    SELECT
    pets.*,
    pu.saved,
    pu.adoption_status AS pets_users_adoption_status,
    pu.user_id AS pets_users_user_id
    FROM
    pets
    LEFT JOIN
    pets_users pu ON pets.id = pu.pet_id
    WHERE
    pets.taken_by_user_id = $1
  
    UNION
  
    SELECT
    pets.*,
    pu.saved,
    pu.adoption_status AS pets_users_adoption_status,
    pu.user_id AS pets_users_user_id
    FROM
    pets_users pu
    JOIN
    pets ON pets.id = pu.pet_id
    WHERE
    pu.saved = true AND pu.user_id = $1
    ORDER BY
    id ASC;
  
      `, [userId]);
    return pet.rows;
  },
  getPets: async (sort = "id", direction = "asc", limit = "10", skip = "0") => {
    const data = await query(`
                SELECT * FROM pets
                ORDER BY ${sort} ${direction}
                LIMIT $1
                OFFSET $2
            `, [limit, skip])
    return data.rows;
  },
  getPetsWithSavedInfo: async (userId, limit = "10", skip = "0") => {
    const data = await query(`
      SELECT pets.*, pets_users.user_id, pets_users.saved, pets_users.id as relation_id
      FROM pets
      LEFT JOIN pets_users ON pets.id = pets_users.pet_id AND pets_users.user_id = $1
      LIMIT $2
      OFFSET $3
    `, [userId, limit, skip]);
    return data.rows;
  },
  getPetsByQuery: async (name = "", type = "", adoption_status = "", height, weight, sort = "id", direction = "asc", limit = "10", skip = "0") => {
    console.log(name, type, adoption_status);
    let condition = "";
    if (type) {
      condition += ` AND type::text ILIKE '${type}'`;
    }
    if (adoption_status) {
      condition += ` AND adoption_status::text ILIKE '%${adoption_status}%'`;
    }
    if (height == 'true') {
      condition += ` OR height = ${Number(name)}`;
    }
    if (weight == 'true') {
      condition += ` OR weight = ${Number(name)}`;
    }
    const content = `
          SELECT * FROM pets
          WHERE (name::text ILIKE '%${name}%' ${condition})
          ORDER BY ${sort} ${direction}
          LIMIT $1
          OFFSET $2
        `;
    const data = await query(content, [limit, skip]);
    console.log(content);
    return data.rows;
  },
  updatePet: async (petId, body) => {
    const data = await query(`
          UPDATE pets
          SET ${Object.keys(body).map(key => `${key}='${body[key]}'`).join(', ')}
          WHERE id = $1`,
      [petId])
      console.log(data.rows);
    return data.rows;
  },
  takePet: async (petId, body) => {
    await query(`
    UPDATE pets
    SET adoption_status = $3, taken_by_user_id = $2
    WHERE id = $1`,
      [petId, body.user_id, body.adoption_status])
    const data = await query(`
    SELECT *
    FROM pets
    WHERE id = $1`,
      [petId])
    return data.rows;
  },
  savePet: async (petId, userId) => {
    const data = await query(`
          INSERT INTO pets_users (pet_id, user_id, saved)
          VALUES ($1, $2, true)
          RETURNING *
        `,
      [petId, userId])
    return data.rows[0];
  },
  deleteSavedPet: async (relation_id) => {
    await query(`
      DELETE FROM pets_users
      WHERE id = $1
      RETURNING 'Pet unsaved successfully' AS message
      `,
      [relation_id]
    );
  },
}

module.exports = services;