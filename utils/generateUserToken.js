import jwt from 'jsonwebtoken';

const generateToken = (userData, role) => {
    return jwt.sign(
        {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '2d',
        }
    );
};

export const generateUserToken = (userData) => {
    return generateToken(userData, 'user');
};

export const generateAdminToken = (adminData) => {
    return generateToken(adminData, 'Admin');
};

export const generatePartnerToken = (partnerData) => {
    return generateToken(partnerData, 'Partner');
};

