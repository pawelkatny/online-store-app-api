const CustomError = require('../error/customError');
const UserService = require('../services/user');
const { StatusCodes } = require('http-status-codes');

const getUsers = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser || !currentUser.hasPermission('view-user')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    const { query } = req;
    //build query object
    const queryObject = {};

    const users = await UserService.getUsers(queryObject);
    
    res.status(StatusCodes.OK).json({ users });
}

const getUser = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser || !currentUser.hasPermission('view-user')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    const { id } = req.params;

    const user = await UserService.getUserById(id);
    if (!user) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ user });
}

const updateUser = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser || !currentUser.hasPermission('edit-user')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const { id } = req.params;
    const { name, email } = req.body;
    const user = await UserService.updateUserById(id, { name, email });

    if (!user) {
        throw new CustomError('Not modified', StatusCodes.NOT_MODIFIED);
    }

    res.status(StatusCodes.OK).send();
}

const deleteUser = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser || !currentUser.hasPermission('edit-user')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const { id } = req.params;
    const user = await UserService.deleteUserById(id);
    if (!user) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).send();
}

const createUser = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser || !currentUser.hasPermission('edit-user')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const { name, email, roleName } = req.body;
    const user = await UserService.createUser({ name, email, roleName });
    if (!user) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.CREATED).json({ user });
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser
}