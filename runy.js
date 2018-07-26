module.exports = {
    host: '101.132.66.66',
    username: 'deploy',
    port: 42777,
    remotePath: '/srv/early-bird',
    git: 'git@gitee.com:eb-cashflow/supplier_ver2.01.git',
    agent: process.env.SSH_AUTH_SOCK,
    commands: [
        'nvm use 9.5.0',
        'git pull origin master',
        'npm install --production=false',
        'npm build'
    ],
};