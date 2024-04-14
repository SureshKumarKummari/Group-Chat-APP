const bcrypt=require('bcrypt');

exports.decrypt=async(pass)=>{
    console.log(pass);
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        //console.log(hashedPassword);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error encrypting password');
    }

}