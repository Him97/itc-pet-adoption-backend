const service = require('../services/pet.service');
const cloudinary = require('cloudinary').v2;
const upload = require('../utils/multer').upload;
const { ERR, ERR_NOT_ALLOWED } = require('../utils/errors');
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
})

module.exports = {
    addPet: async (req, res, next) => {
        try {
            upload.single('picture')(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading image:', err);
                    return res.status(500).send('Error uploading image');
                }
                if (!req.file) {
                    console.error('No image file provided');
                    return res.status(400).send('No image file provided');
                }
                cloudinary.uploader.upload_stream(async (error, result) => {
                    if (error) {
                        console.error('Error uploading image to Cloudinary:', error);
                        return res.status(500).send('Error uploading image to Cloudinary');
                    }
                    const newPet = await service.addPet({
                        type: req.body.type,
                        name: req.body.name,
                        adoption_status: req.body.adoption_status,
                        height: req.body.height,
                        weight: req.body.weight,
                        color: req.body.color,
                        bio: req.body.bio,
                        hypoallergenic: req.body.hypoallergenic,
                        dietary_restrictions: req.body.dietary_restrictions,
                        breed: req.body.breed,
                        picture: result.url,
                    });
                    console.log('Newly added pet:', newPet);
                    res.status(201).send({ id: newPet });
                }).end(req.file.buffer);
            });
        } catch (error) {
            console.error('Unhandled error:', error);
            next(error);
        }
    },
    getPets: async (req, res, next) => {
        try {
            if (req.query.id) {
                try {
                    const { id } = req.query;
                    const data = await service.getPetsWithSavedInfo(id);
                    console.log('userId also passed:',data);
                    res.send(data);
                } catch (error) {
                    next(ERR);
                }
            } else if (Object.keys(req.query).length > 0) {
                const { type, adoption_status, height, weight, name } = req.query;
                const data = await service.getPetsByQuery(name, type, adoption_status, height, weight);
                console.log('this is search',data);
                res.send(data);
            }
            else {
                const data = await service.getPets();
                res.send(data);
            }
        } catch (error) {
            next(ERR);
        }
    },
    getPetById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const {userId} = req.query;
            console.log(id,userId)
            const pet = await service.getPetById(id,userId);
            console.log(pet)
            res.send(pet);
        } catch (error) {
            next(ERR);
        }
    },
    getPetsByUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const pet = await service.getPetByUser(id);
            console.log(pet)
            res.send(pet);
        } catch (error) {
            next(ERR);
        }
    },
    editPet: async (req, res) => {
        try {
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading image:', err);
                    return res.status(500).send('Error uploading image');
                }
                if (!req.file) {
                    console.error('No image file provided');
                    return res.status(400).send('No image file provided');
                }
                cloudinary.uploader.upload_stream(async (error, result) => {
                    if (error) {
                        console.error('Error uploading image to Cloudinary:', error);
                        return res.status(500).send('Error uploading image to Cloudinary');
                    }
                    const { id } = req.params;
                    console.log(id,'and',req.body)
                    const pet = await service.updatePet(id,{
                        type: req.body.type,
                        name: req.body.name,
                        adoption_status: req.body.adoption_status,
                        height: req.body.height,
                        weight: req.body.weight,
                        color: req.body.color,
                        bio: req.body.bio,
                        hypoallergenic: req.body.hypoallergenic,
                        dietary_restrictions: req.body.dietary_restrictions,
                        breed: req.body.breed,
                        picture: result.url,
                    });
                    console.log('Edited pet', pet);
                    res.status(201).send(pet);
                }).end(req.file.buffer);
            });
        } catch (error) {
            console.error('Unhandled error:', error);
            next(error);
        }
    },
    adoptPet: async (req, res, next) => {
        try {
            const { id } = req.params;
            const {user_id} = req.body;
            console.log(id,user_id);
            const pet = await service.takePet(id, { adoption_status: 'Adopted',user_id });
            console.log(pet);
            res.send(pet);
        } catch (error) {
            next(ERR);
        }
    },
    fosterPet: async (req, res, next) => {
        try {
            const { id } = req.params;
            const {user_id} = req.body;
            console.log(id, user_id);
            const pet = await service.takePet(id, { adoption_status: 'Fostered', user_id });
            console.log(pet);
            res.send(pet);
        } catch (error) {
            next(ERR);
        }
    },
    returnPet: async (req, res, next) => {
        try {
            const { id } = req.params;
            const pet = await service.takePet(id, { adoption_status: 'Available', user_id:null });
            console.log(pet);
            res.send(pet);
        } catch (error) {
            next(ERR);
        }
    },

    savePet: async (req, res, next) => {
        console.log(req.params, req.body);
        try {
            const { id } = req.params;
            const {user_id}= req.body;
            const save = await service.savePet(id, user_id);
            console.log(save);
            res.send(save);
        } catch (error) {
            next(ERR);
        }
    },
    deleteSavedPet: async (req, res, next) => {
        try {
            const { id} = req.params;
            const result = await service.deleteSavedPet(id);
            console.log(result);
            res.send(result);
        } catch (error) {
            next(ERR);
        }
    },
}