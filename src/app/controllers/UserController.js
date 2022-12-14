import * as Yup from 'yup';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class UserController {
    async create (req,res) {
        try { 
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                password: Yup.string().required().min(6),
            });

            if(!(await schema.isValid(req.body))){
                return res.status(400).json({ error: 'Validation fails'});
            };

            const userExists = await User.findOne({ where: { email: req.body.email}});

            if (userExists) {
                return res.status(400).json({ error: 'User already exists.'});
            }

            const {id, name, email} = await User.create(req.body);
            
            return res.status(201).json({
                user:{
                    id,
                    name,
                    email
                },
                token: jwt.sign({ id}, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                }),
                msg:"registration successful"
            });
            
        } catch (error) {
            console.log(req.body);
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong'});
            
        }
    }
}

export default new UserController();