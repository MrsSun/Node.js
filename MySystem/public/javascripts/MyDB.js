
var mongo = require('mongodb')
var crypto = require('crypto')
var host = "localhost"
var port = 27017
var server = new mongo.Server(host,port,{auto_reconnect:true},{safe:true})
var db = new mongo.Db('StudentCourseSystem05',server,{safe:true})


//定义三个集合
var strStudent = {_id:143,name:'chaoer',major:'数字媒体技术',courseId:1,password:'student',power:1}

var strTeacher = {_id:5,name:'MrLi',major:'数字媒体技术',contact:'17854259124',course:'1',password:'teacher',power:0}

var strCouse = {_id:5,name:'English',teacher:'teacher'}

var strAdmin = {_id:5,name:'admin',password:'admin',power:2}
//往数据库中插入初始数据
exports.initCreate =  function() {
   db.open(function (err,db) {
       if(err) throw err
       else {
           console.log('成功打开数据库')
           db.collection('student',function (err,collection) {
               if(err) throw err;
               else {
                  collection.insert(strStudent,function (err,docs) {
                      if(err) throw err;
                      else {
                          console.log('成功添加学生表')
                          console.log(docs)
                      }
                  });
               }
           })

           db.collection('teacher',function (err,collection) {
               if(err) throw err
               else {
                   collection.insert(strTeacher,function (err,docs) {
                       if(err) throw err
                       else {
                           console.log('成功添加老师表')
                           console.log(docs)
                       }
                   })
               }
           })

           db.collection('course',function (err,collection) {
               if(err) throw err
               else {
                   collection.insert(strCouse,function (err,docs) {
                       if(err) throw err
                       else {
                           console.log('成功添加课程表')
                           console.log(docs)
                       }
                   })
               }
           })

           db.collection('admin',function (err,collection) {
               if(err) throw err
               else {
                   collection.insert(strAdmin,function (err,docs) {
                       if(err) throw err
                       else {
                           console.log('成功添加管理员表')
                           console.log(docs)
                       }
                   })
               }
           })
       }
   })
}

//登录界面登录信息的检查
exports.checkLogin = function (power, userID, userPassword, callback) {
       db.open(function (err, db) {
        if(err) throw err
        else {
            console.log('成功打开数据库')
            //根据power值判断到底连接哪个表
            var table
            if(power == 0)
                table = 'teacher'
            if(power == 1)
                table = 'student'
            if(power == 2)
                table = 'admin'
            console.log(table)
            db.collection(table,function (err,collection) {
                if(err) throw err
                else {
                     console.log('成功连接')
                    collection.find({_id:userID,password:userPassword}).toArray(function (err,docs) {
                        if(err) throw err
                        else {
                            console.log('数组查寻结果：')
                            if(docs.length){
                                console.log('用户名密码正确')
                                callback(true)
                            }
                            else {
                                console.log('用户名密码错误')
                                callback(false)
                            }
                        }
                    })
                }
                db.close()
            })
        }
    })
}

//查寻课程表
exports.courseFind = function (courseID,callback) {
    db.open(function (err,db) {
        if(err) throw err
        else {
            db.collection('course',function (err,collection) {
                if(err) throw err
                else {
                    if(courseID == ''){
                        collection.find({}).toArray(function (err,docs) {
                            if(err) throw err
                            else {
                                callback(docs)
                            }
                        })
                    }
                    else {
                        collection.find({_id:courseID}).toArray(function (err,docs) {
                            if(err) throw err
                            else {
                                callback(docs)
                            }
                        })
                    }
                }
            })
        }
        db.close()
    })
}

//查寻学生已选课程信息
exports.studentFind = function ( userID,callback) {
    db.open(function (err,db) {
        if(err) throw err
        else {
            db.collection('student', function (err,collection) {
                if(err) throw err
                else {
                    collection.find({_id:userID}).toArray(function (err,docs) {
                        if(err) throw err
                        else {
                            console.log(docs)
                            callback(docs)
                        }
                    })
                }
            })
        }
        db.close()
    })
}

//更改指定power指定userID的密码
exports.passwordRevise = function (power,userID,newPassword) {
    var users
    db.open(function (err, db) {
        if(err) throw err
        else {
            var table
            if(power == 0)
                table = 'teacher'
            if(power == 1)
                table = 'student'
            if(power == 2)
                table = 'admin'
        }
         db.collection(table,function (err,collection) {
             if(err) throw err
             else {
                 collection.find({_id:userID}).toArray(function (err,docs) {
                     if(err) throw err
                     else {
                         var result = docs
                         console.log(result)
                         users = {
                                  name:'chao',
                                  major:'数字媒体技术',
                                  courseId:1,
                                  password:'student',
                                  power:1
                                 }
                         result.forEach(function (account) {
                             users.name = account.name;
                             users.major = account.major;
                             users.courseId = account.courseId;
                             users.password = newPassword;
                             users.power = account.power;
                         })
                         collection.update({_id:userID},users,function (err,result) {
                             console.log('Hello Update')
                             collection.find({}).toArray(function (err,docs) {
                                 if(err) throw err
                                 else {
                                     console.log(docs)
                                     db.close()
                                 }
                             })
                         })
                     }

                 })
             }
         })
    })
}

//查看所有学生的信息
exports.studentFindAll = function (callback) {
    db.open(function (err,db) {
        if(err) throw err
        else {
            db.collection('student',function (err,collection) {
                if(err) throw err
                else {
                    collection.find({}).toArray(function (err,docs) {
                        if(err) throw err
                        else {
                            callback(docs)
                        }
                    })
                }
            })
        }
    })
}

// //增加信息
// exports.add = function (table, user) {
//     db.open(function (err, db) {
//         if(err) throw err
//         else {
//             db.collection(table,function (err,collection) {
//                 if(err) throw err
//                 else {
//                     collection.insert(user,function (err) {
//                         if(err) throw err
//                         else {
//                             console.log('插入成功')
//                         }
//                     })
//                 }
//             })
//         }
//     })
// }

// //删除某行数据
// exports.Delete = function (table,userID) {
//     db.open(function (err,db) {
//         if(err) throw err
//         else {
//             db.collection(table,function (err,collection) {
//                 if(err) throw err
//                 else {
//                     collection.remove({_id:userID},function (err,result) {
//                         if(err) throw err
//                         else {
//                             console.log('成功删除，删除后的数据为：')
//                             console.log(result)
//                         }
//                     })
//                 }
//             })
//         }
//     })
// }











