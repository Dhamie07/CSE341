const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllContacts = async (req, res, next) => {
    const result = await mongodb.getDatabase().collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    });
};

const getContactById = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid Contact ID format. ID must be a 24-character hex string.');
    }
    const contactId = new ObjectId(req.params.id);
    const contact = await mongodb.getDatabase().collection('contacts').findOne({ _id: contactId });
    if (contact) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contact);
    } else {
        res.status(404).json('Contact not found');
    }
};

const createContact = async (req, res, next) => {
    const newContact = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        email: req.body.email,
        phone: req.body.phone
    };
    const response = await mongodb.getDatabase().collection('contacts').insertOne(newContact);
    
    if (response.acknowledged) {
        res.status(201).json({ id: response.insertedId, message: 'Contact created successfully' });
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
}   


const updateContact = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid Contact ID format. ID must be a 24-character hex string.');
    }

    const contactId = new ObjectId(req.params.id);
    const updatedContact = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        email: req.body.email,
        phone: req.body.phone
    };
    const response = await mongodb.getDatabase().collection('contacts').updateOne({ _id: contactId }, { $set: updatedContact });
    
    if (response.modifiedCount > 0) {
        res.status(204).send(); 
    } else if (response.matchedCount === 0) {
        res.status(404).json('Contact not found');
    } else {
        res.status(500).json('No changes were made or an error occurred.');
    }
}   

const deleteContact = async (req, res, next) => {
    // 1. Validate ID
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid Contact ID format. ID must be a 24-character hex string.');
    }
    
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('contacts').deleteOne({ _id: contactId});
    
    if (response.deletedCount > 0) {
        res.status(204).send(); 
    } else if (response.deletedCount === 0) {
        res.status(404).json('Contact not found');
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
} 

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};