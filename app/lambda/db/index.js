const Sequelize = require('sequelize')
const pg = require('pg');

require('dotenv').config()
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    define: {
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
        timestamps: false
    }
});

const File = sequelize.define('file', {
    id: {
        type: Sequelize.BIGINT, primaryKey: true
    },
    slug: {
        type: Sequelize.STRING(32)
    },
    filename: {
        type: Sequelize.STRING(256)
    },
    size: {
        type: Sequelize.INTEGER, defaultValue: 0
    },
    path: {
        type: Sequelize.STRING(256)
    },
    source: {
        type: Sequelize.STRING(32), defaultValue: 'web'
    },
    dl_num: {
        type: Sequelize.INTEGER, defaultValue: 0, field: 'dl_num'
    },
    hash: {
        type: Sequelize.STRING(46)
    },
    status: {
        type: Sequelize.STRING(1), defaultValue: 'Y'
    },
    created_at: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'created_at'
    },
    updated_at: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'updated_at'
    },
    lastdl_at: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'lastdl_at'
    }
}, {
    freezeTableName: true,
})


const getAllFiles = async () => {
    const items = await File.findAll()
    console.info('items:', items)
    return items
}

const saveFile = async (item) => {
    const result = await File.create(item)
    console.info(result)
}

const updateFile = async (id, item) => {
    const file = await File.update(item, {where: {id}})
    console.info('file:', file)
    return file
}

const getFile = async (id) => {
    const file = await File.findByPk(id)
    console.info('file:', file)
    return file
}

module.exports = {
    getAllFiles,
    saveFile,
    updateFile,
    getFile,
}