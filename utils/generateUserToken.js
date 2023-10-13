import jwt from 'jsonwebtoken'

const generateTocken = (res,userId) =>{
    
    const tocken = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:'2d'
    })
     res.cookie('jwtuser',tocken,{
        httpOnly:true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:'strict',
        maxAge: 2 * 24 * 60 *60 * 1000
    })

     return tocken
}

export default generateTocken;
