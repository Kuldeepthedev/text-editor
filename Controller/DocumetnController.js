const Document = require('../Model/DoqumentModel');
const bcrypt = require('bcryptjs');


const createDocument = async(req,resp)=>{
    const { title, password} = req.body;
    console.log(title,password)
    const document = await Document.findOne({title:title});
    try{
        if (document) {
            resp.status(200).json({
                status: false,
                message:"File name already exits"
            });
        } else {
            const hashpassword = await bcrypt.hash(password, 10);
            
            const createnewDocument = await Document.create({
                title: title,
                password: hashpassword,
                createdBy: req.userData._id
            });
            
            resp.status(200).json({
                status: true,
                document: createnewDocument
            });
        }
    }
    catch(error){
        
        resp.status(201).json({
            status:false,
            message:"Error while creating a new document"
        })
    }
};

const getAllDocument = async(req,resp)=>{
    const document = await Document.find({}, '-password -content');
    try{
        if (document) {
            resp.status(200).json({
                status: true,
                document
            });
        }
    }
    catch(error){
        resp.status(201).json({
            status:false,
            message:"Error while creating a new document"
        })
    }
};
const openDocument = async (req, resp) => {
    try {
        const { password } = req.body;
        
        if (!password) {
            return resp.status(400).json({
                status: false,
                message: "Password is required to access the document."
            });
        }
          
        const document = await Document.findById(req.params.id).select('+password');

        if (!document) {
            return resp.status(404).json({
                status: false,
                message: 'Document not found'
            });
        }
        console.log(document)
        const matchPassword = await bcrypt.compare(password, document.password);
        
        if (matchPassword) {
            return resp.status(200).json({
                status: true,
                document
            });
        } else {
            return resp.status(401).json({
                status: false,
                message: 'Incorrect password'
            });
        }
    } catch (error) {
        console.error(error);
        return resp.status(500).json({
            status: false,
            message: 'Error while retrieving the document'
        });
    }
};
const getDocument = async (req, resp) => {
    try {
         
          
        const document = await Document.findById(req.params.id);

        if (!document) {
            return resp.status(404).json({
                status: false,
                message: 'Document not found'
            });
        }
                else{return resp.status(200).json({
                status: true,
                document
            })};
            
        
    } catch (error) {
        console.error(error);
        return resp.status(500).json({
            status: false,
            message: 'Error while retrieving the document'
        });
    }
};
const updateDocument = async (req, resp) => {
    try {
        const { content } = req.body;
        
        const updatedDocument = await Document.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    content,
                    lastupdateAT: Date.now(),
                },
                $push: {
                    updateBy: {
                        user: req.userData._id,
                        updateAT: Date.now(),
                    },
                },
            },
            
        );

        if (updatedDocument) {
            resp.status(200).json({
                status: true,
                document: updatedDocument,
            });
        } else {
            resp.status(404).json({
                status: false,
                message: 'Document not found',
            });
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            status: false,
            message: 'Error in updating the document',
        });
    }
};


module.exports = { createDocument, getAllDocument, getDocument, updateDocument,openDocument };