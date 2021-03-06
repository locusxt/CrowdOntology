

var data = require('./data');
var db = require('./db');
var server_config = require('../server_config.json');
var format = require('./format');
var formatExchange = new format();
const logger = require("../logger_config");

var DataManager = require('./dm');
var dm = new DataManager(server_config);
// console.log(dm);

function ioConfig(server){

    var io = require('socket.io')(server);

    io.on('connection', function(socket) {
        //socket建立连接
        console.log('a user connected');
        socket.emit('data', db)
        //socket断开连接
        socket.on('disconnect', function () {
            console.log('user disconnected');
        })
        //测试用
        socket.on('save model', function (msg) {
            //console.log("save model")
            //console.log(msg);
            db["instance_model"][msg.user] = msg.instance_model;
            //data.instance_model = msg.instance_model;
            //socket.emit('chat message',msg)
            console.log(db);
        })
        socket.on('model', function(msg){
            logger.info(JSON.stringify(msg))
            console.log(msg);
            let emitMsg;
            switch (msg.operation){
                case 'mget':
                    /*
                    emitMsg = io_get_model(msg,function(emitMsg){
                        socket.emit('model',emitMsg);
                    });*/
                    dm.handle(msg, function(rep){
                        console.log("model")
                        console.log(rep)
                        logger.trace(JSON.stringify(rep))
                        socket.emit("model",rep);
                    });
                    break;
            }
        })

        socket.on('insModel', function(msg){
            logger.info(JSON.stringify(msg))
            console.log(msg);
            let emitMsg;

            switch (msg.operation){
                case 'get':
                    /*
                    emitMsg = io_get_insModel(msg,function(emitMsg){
                        socket.emit('insModel',emitMsg);
                    });*/
                    console.log("insModel")
                    dm.handle(msg, function(rep){
                        console.log(rep)
                        logger.trace(JSON.stringify(rep))
                        socket.emit("insModel",rep);
                    });
                    break;
                case 'create_node':
                    emitMsg = io_create_insModel_node(msg,function(emitMsg){
                        //console.log(emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'remove_node':
                    emitMsg = io_remove_insModel_node(msg,function(emitMsg){
                        //console.log(emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'create_relation':
                    emitMsg = io_create_insModel_relation(msg,function(emitMsg){
                        //console.log(emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'remove_relation':
                    emitMsg = io_remove_insModel_relation(msg,function(emitMsg){
                        //console.log(emitMsg);
                        logger.info(JSON.stringify(emitMsg))
                        socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'revise_relation':
                    emitMsg = io_revise_insModel_relation(msg);
                    break;
                case 'rcmd_node':
                    emitMsg = io_recommend_insModel_node(msg);
                    break;
                case 'rcmd_relation':
                    emitMsg = io_recommend_insModel_relation(msg);
                    break;
                case 'rcmd':
                    emitMsg = io_recommend_insModel(msg,function(emitMsg){
                        logger.info(JSON.stringify(emitMsg))
                        socket.emit('insModel',emitMsg);
                    });
                    break;
                case 'rcmdIndex':
                    dm.handle(msg, function(rep){
                        logger.trace(JSON.stringify(rep))
                        socket.emit("insModel",rep);
                    });
                    break;
                case 'rcmd_entity':
                    dm.handle(msg, function(rep){
                        logger.trace(JSON.stringify(rep))
                        socket.emit("insModel",rep);
                    });
                    break;
            }
            //console.log(emitMsg);
            //socket.emit('insModel',emitMsg);
        });

        //先不管。。。我也不知道写的什么
        socket.on('get',function(msg){
        })

        socket.on('revise',function(msg){
            [type,reply] = reviseMsg(msg);
            socket.emit(type,reply);
        })

        socket.on('recommend',function(msg){
        })

        //just for test
        socket.on('iotest',function(msg){
            console.log(msg);
            msg0 = {
                operation:'init'
            };
            msg1 = {
                operation: 'create_user',
                operation_id: 'opt1',
                name: '123@123'
            };
            msg1_2 = {
                operation: 'create_user',
                operation_id: 'opt1',
                name: 'user1@mail'
            };
            msg1_3 = {
                operation: 'create_user',
                operation_id: 'opt1',
                name: 'user2@mail'
            };
            msg2 = {
                operation: 'create_project',
                operation_id: 'opt2',
                name: '红楼梦人物关系图谱'
            };
            msg3 = {
                operation: 'mcreate_node',
                user_id : 'user1@mail.com',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: '',
                        tag : 'Entity',
                        value : '人'
                    }
                ]
            };
            msg2_9 = {
                operation: 'mcreate_node',
                user_id : '123@132',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: '',
                        tag : 'Symbol',
                        value : 'String'
                    }
                ]
            };
            msg4 = {
                operation: 'mcreate_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        value: '亲友',
                        roles:[
                            {rolename : '亲友',
                            node_id : 110},
                            {rolename : '亲友',
                            node_id : 110}
                        ]
                    }
                ]
            };
            msg4_1 = {
                operation: 'mcreate_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        value: '性别',
                        roles:[
                            {rolename : '',
                                node_id : 110},
                            {rolename : '性别',
                                node_id : 110}
                        ]
                    }
                ]
            };
            msg4_2 = {
                operation: 'mcreate_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        value: '姓名',
                        roles:[
                            {rolename : '',
                                node_id : 110},
                            {rolename : '姓名',
                                node_id : 110}
                        ]
                    }
                ]
            };
            msg5 = {
                operation: 'mget',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2'
            };
            msg6 = {
                operation: 'create_node',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: '',
                        tags : [110], //tag用id表示
                        value: '西瓜人' //实体的value为空
                    }
                ]
            };
            msg7 = {
                operation: 'create_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        tag: 112, //用tagid表示
                        roles:[{
                            rolename : '',
                            node_id : 252,
                        },
                        {
                            rolename : '兄弟',
                            node_id : 114,
                        }
                        ]
                    }
                ]
            };
            msg8 = {
                operation: 'get',
                user_id : 'user2@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2'
            };
            msg9 = {
                operation: 'remove_node',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes: [
                    162
                ]
            };
            msg10 = {
                operation: 'remove_relation',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations: [
                    164
                ]
            };
            msg11 = {
                operation: 'get_tags',
                user_id : '123@123',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                node: {
                    value:'冬瓜'
                }
                
            };
            msg12 = {
                operation: 'refer',
                user_id : 'user1@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                node:{
                    front_id: '',
                    refer_id: 14
                }
            };
            msg13 = {
                operation: 'create_node_proxy',
                user_id : 'user2@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        front_id: 'front_n人',
                        tags : ["167"], //tag用id表示
                        value: "贾宝玉" //实体的value为空
                    }
                ]
            };
            msg14 = {
                operation: 'create_relation_proxy',
                user_id : 'user2@mail',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                relations:[
                    {
                        front_id:'',
                        tag: 171, //用tagid表示
                        roles:[{
                            rolename : '',
                            node_id : 174,
                        },
                        {
                            rolename : '姓名',
                            node_id : 176,
                        }
                        ]
                    }
                ]
            };
            msg15 = {
                operation: 'rcmd',
                user_id : 'zhut@pku.edu.cn',
                project_id : '电影人物关系图谱',
                operation_id : 'op2',
                nodes:{
                    143:{//内部信息目前都用不着
                        tags: [],
                        value: ""
                    }
                }
            };

            msg16 = {
                operation: 'get_user',
                operation_id: 'opt1',
                name: '123@12'
            };
            
            msg17 = {
                operation: 'rcmd_entity',
                user_id : 'zhut@pku.edu.cn',
                project_id : '红楼梦人物关系图谱',
                operation_id: 'opt2',
                topk: 7
            };
            
            msg18 = {
                operation: 'new_rcmd',
                user_id : 'zhut@pku.edu.cn',
                project_id : '红楼梦人物关系图谱',
                operation_id : 'op2',
                nodes:{
                    143:{//内部信息目前都用不着
                        tags: [],
                        value: ""
                    }
                }
            };

            msg19 = {
                operation: 'madd_key_attr',
                user_id : 'zhut@pku.edu.cn',
                project_id : '电影人物关系图谱',
                operation_id : 'op2',
                nodes :[
                    {
                        id: '667',
                        key_attr_list: ['621']
                    }
                ]
            }

            //initiate Set
            if(msg == "init"){
                init_project();
            }else if(msg=="mcreate_hlm"){
                mcreate_hlm_project();
            }else if(msg=="mcreate_movie"){
                mcreate_movie_project();
            }else{
                let msgArray = [msg0,msg1,msg2,msg3,msg4,msg5,msg6,msg7,msg8,msg9,msg10,msg11,msg12,msg13,msg14,msg15,msg16, msg17, msg18, msg19];
                dm.handle(msgArray[msg], function(rep){
                    console.log('[CALLBACK]')
                    console.log(rep);
                    socket.emit('iotest_back', rep);
                });
            }
        })
    });
}


function reviseMsg(msg){
/*
 {
     "operation": "create_node" ,
     "user_id": "u1" ,
     //"operationID": "操作的时间" //用来区分操作
     "node": {
     "nodeid": "__front__1",
     "tags": ["人"]
 }
*/
    switch(msg.operation){
        case "create_node":
            break;
        case "delete_node":
            break;
        case "revise_node":
            break;
        case "create_relation":
            break;
        case "delete_relation":
            break;
        case "revise_relation":
            break;
    }

}

function emitMsgHeader(rcvMsg,err,msg){
    let emitMsg = {
        "operation":rcvMsg.operation,
        "user":rcvMsg.user,
        "project": rcvMsg.project, //仅测试使用
        "operationId":rcvMsg.operationId,
        "err":err,
        "msg":msg,
        "migrate":{}
    }
    return emitMsg;
}

function io_create_insModel_node(rcvMsg,callback){

    let newMsg = formatExchange.web2Server(rcvMsg);

    console.log("\n******")
    console.log(newMsg)
    console.log("******\n")

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        console.log('[CALLBACK]')
        console.log(rep);
        callback(emitMsg);
    });

    return;
/*
    //forTest
    let emitMsg = emitMsgHeader(rcvMsg,null,null);
    for(let key in rcvMsg.nodes){
        emitMsg.migrate[key] = "back_"+key.slice(6);
        break;
    }
    return emitMsg;
    */
}

function io_remove_insModel_node(rcvMsg,callback){
    let newMsg = formatExchange.web2Server(rcvMsg);

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        console.log('[CALLBACK]')
        console.log(rep);
        callback(emitMsg);
    });

    return;
}

function io_create_insModel_relation(rcvMsg,callback){

    let newMsg = formatExchange.web2Server(rcvMsg);

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        console.log('[CALLBACK]')
        console.log(rep);
        callback(emitMsg);
    });

    return;
}

function io_remove_insModel_relation(rcvMsg,callback){

    let newMsg = formatExchange.web2Server(rcvMsg);

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.migrate = rep.migrate;
        console.log('[CALLBACK]')
        console.log(rep);
        callback(emitMsg);
    });

    return;
}


function io_recommend_insModel(rcvMsg,callback){
    let newMsg = formatExchange.web2Server(rcvMsg);

    dm.handle(newMsg, function(rep){
        let emitMsg = emitMsgHeader(rcvMsg,null,null);
        emitMsg.nodes = rep.nodes;
        emitMsg.relations = rep.relations;
        emitMsg.rcmd_relations = rep.rcmd_relations;
        emitMsg.migrate = rep.migrate;
        console.log('[CALLBACK]')
        console.log(rep);
        callback(emitMsg);
    });

    return;
}

function mcreate_user(user){
    let msg = {
        operation: 'create_user',
        operation_id: 'opt0',
        name: user
    };
    return msg;
}

function mcreate_relation(value,rolename1="",rolename2="",id1="",id2="",project_id){
    let msg = {
        operation: 'mcreate_relation',
        user_id : '123@123',
        project_id : project_id,
        operation_id : 'op0',
        relations:[
            {
                front_id:'frontr_1',
                value: value,
                roles:[
                    {rolename : rolename1,
                        node_id : id1},
                    {rolename : rolename2,
                        node_id : id2}
                ]
            }
        ]
    };
    return msg;
}

function mcreate_node(tag,value,project_id,user_id="user@mail"){
    let msg = {
        operation: 'mcreate_node',
        user_id : user_id,
        project_id : project_id,
        operation_id : 'op0',
        nodes :[
            {
                front_id: '',
                tag : tag,
                value : value
            }
        ]
    };
    return msg;
}

function madd_key_attr(node_id,arrlist,user_id,project_id){
    msg = {
        operation: 'madd_key_attr',
        user_id : user_id,
        project_id : project_id,
        operation_id : 'op0',
        nodes :[
            {
                id: node_id,             //'667',
                key_attr_list: arrlist  //['621']
            }
        ]
    }

    return msg;
}

function init_project(){
    msg0 = {operation:'init'};

    dm.handle(msg0, function(rep) {
        dm.handle(mcreate_user("user@mail"), function (rep) {});
        dm.handle(mcreate_user("user1@mail"), function (rep) {});
        dm.handle(mcreate_user("user2@mail"), function (rep) {});
        dm.handle(mcreate_user("jiangy@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("liby@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("shenn@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("wangp@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("wangxm@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("weiyh@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangyx@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangxy@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhut@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("chuwj@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangzf@pku.edu.cn"), function (rep) {});
        dm.handle(mcreate_user("zhangmy@pku.edu.cn"), function (rep) {console.log("zhangmy@pku.edu.cn")});
        console.log("xxxxxxx");
    });
}


function mcreate_hlm_project(){
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: '红楼梦人物关系图谱'
    };
    var humanId,movieId,roleId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", "红楼梦人物关系图谱"), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Symbol", "String", "红楼梦人物关系图谱"), function (rep) {
                for (let key in rep.migrate) symbolId = rep.migrate[key];
                //创建属性
                dm.handle(mcreate_relation("姓名",rolename1="",rolename2="姓名",id1=humanId,id2=symbolId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("性别",rolename1="",rolename2="性别",id1=humanId,id2=symbolId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("出生日期",rolename1="",rolename2="出生日期",id1=humanId,id2=symbolId,project_id="红楼梦人物关系图谱"),function(rep){});
                //创建关系
                dm.handle(mcreate_relation("父子",rolename1="父亲",rolename2="儿子",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("母子",rolename1="母亲",rolename2="儿子",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("父女",rolename1="父亲",rolename2="女儿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("母女",rolename1="母亲",rolename2="女儿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});

                dm.handle(mcreate_relation("夫妻",rolename1="丈夫",rolename2="妻子",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});

                dm.handle(mcreate_relation("公媳",rolename1="公公",rolename2="媳妇",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("婆媳",rolename1="婆婆",rolename2="媳妇",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("翁婿",rolename1="岳父",rolename2="女婿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("姑婿",rolename1="岳母",rolename2="女婿",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});

                dm.handle(mcreate_relation("兄弟",rolename1="哥哥",rolename2="弟弟",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("兄妹",rolename1="哥哥",rolename2="妹妹",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("姐弟",rolename1="姐姐",rolename2="弟弟",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
                dm.handle(mcreate_relation("姐妹",rolename1="姐姐",rolename2="妹妹",id1=humanId,id2=humanId,project_id="红楼梦人物关系图谱"),function(rep){});
            });
        });
    });
    return;
}

function mcreate_movie_project(){
    msg1 = {
        operation: 'create_project',
        operation_id: 'opt2',
        name: '电影人物关系图谱'
    };
    var humanId,movieId,roleId,symbolId;
    dm.handle(msg1, function(rep) {
        dm.handle(mcreate_node("Entity", "人", "电影人物关系图谱"), function (rep) {
            for (let key in rep.migrate) humanId = rep.migrate[key];
            dm.handle(mcreate_node("Entity", "电影", "电影人物关系图谱"), function (rep) {
                for (let key in rep.migrate) movieId = rep.migrate[key];
                dm.handle(mcreate_node("Entity", "电影人物", "电影人物关系图谱"), function (rep) {
                    for (let key in rep.migrate) roleId = rep.migrate[key];
                    dm.handle(mcreate_node("Symbol", "String", "电影人物关系图谱"), function (rep) {
                        for (let key in rep.migrate) symbolId = rep.migrate[key];
                        //创建属性
                        dm.handle(mcreate_relation("姓名",rolename1="",rolename2="姓名",id1=humanId,id2=symbolId,project_id="电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=humanId,[relationId],user_id="",project_id="电影人物关系图谱"),function(rep){});
                        });
                        dm.handle(mcreate_relation("性别",rolename1="",rolename2="性别",id1=humanId,id2=symbolId,project_id="电影人物关系图谱"),function(rep){});
                        dm.handle(mcreate_relation("出生年份",rolename1="",rolename2="出生年份",id1=humanId,id2=symbolId,project_id="电影人物关系图谱"),function(rep){});


                        dm.handle(mcreate_relation("片名",rolename1="",rolename2="片名",id1=movieId,id2=symbolId,project_id="电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=movieId,[relationId],user_id="",project_id="电影人物关系图谱"),function(rep){});
                        });
                        dm.handle(mcreate_relation("上映日期",rolename1="",rolename2="上映日期",id1=movieId,id2=symbolId,project_id="电影人物关系图谱"),function(rep){});

                        dm.handle(mcreate_relation("名称",rolename1="",rolename2="名称",id1=roleId,id2=symbolId,project_id="电影人物关系图谱"),function(rep){
                            let relationId;
                            for (let key in rep.migrate) relationId = rep.migrate[key];
                            dm.handle(madd_key_attr(node_id=roleId,[relationId],user_id="",project_id="电影人物关系图谱"),function(rep){});
                        });
                        dm.handle(mcreate_relation("性别",rolename1="",rolename2="性别",id1=roleId,id2=symbolId,project_id="电影人物关系图谱"),function(rep){});
                        //创建关系
                        dm.handle(mcreate_relation("导演", rolename1 = "导演", rolename2 = "电影", id1 = humanId, id2 = movieId, project_id = "电影人物关系图谱"), function (rep) {});
                        dm.handle(mcreate_relation("出演", rolename1 = "演员", rolename2 = "电影", id1 = humanId, id2 = movieId, project_id = "电影人物关系图谱"), function (rep) {});
                        dm.handle(mcreate_relation("饰演", rolename1 = "演员", rolename2 = "角色", id1 = humanId, id2 = roleId, project_id = "电影人物关系图谱"), function (rep) {});
                        dm.handle(mcreate_relation("角色", rolename1 = "角色", rolename2 = "电影", id1 = roleId, id2 = movieId, project_id = "电影人物关系图谱"), function (rep) {});
                    });
                });
            });
        });
    });
    return;
}
module.exports = ioConfig;