var express = require('express');
var router = express.Router();
var cookies = require('cookie')
var crypto = require('crypto')

/* GET home page. */
var myDB = require('./../public/javascripts/MyDB.js')
router.get('/', function(req, res, next) {
  //运行initCreate()函数实现向数据库中添加student，teacher，admin集合
  //  myDB.initCreate()
  res.render('login',
      { title: 'Express',successIsNot:'none' ,table_display1:'none',table_display2:'none',table_display3:'none',course:[],userID:''});
});

/*
   登录界面
 */
router.get('/login',function (req,res) {
    res.render('login',{ title: 'Express',successIsNot:'none' ,table_display1:'none',table_display2:'none',course:[],userID:''});
})

function hashPW(userID,password) {
    var hash = crypto.createHash('md5');
    hash.update(userID + password)
    return hash.digest('hex')
}

function isLogined(req){
    if(req.cookies["account"] != null){
        var account = req.cookies["account"]
        var user = account.account
        var hash = account.hash
        users.forEach(function (row) {
             if(row.account === user && row.hash === hash){
                 return true
             }
        })
    }
    return false
}

var users;
router.post('/login',function (req,res) {
    var userID = parseInt(req.body.txUsername)
    var password = req.body.pwPassword+''
    var power = parseInt(req.body.InputPower)
    var hash = hashPW(userID,password)
    //用于测试，检测输入数据
    console.log(userID)
    console.log(password)
    console.log(power)
    myDB.checkLogin(power,userID,password,function (ok) {
        //ok == true说明登录成功
        if(ok){
            var time = Date().toString()
            console.log(time)
            users = [{
                userID: userID,
                hash:hashPW(userID,password),
                last:time
            }]
            res.cookie("account",{power:power,account:userID,hash:hash,last:time},{maxAge:60000})
            if(power == 0)//权限为0，打开teacher.ejs页面
                res.render('teacher',
                    {title:'teacher',successIsNot:'none' ,
                        table_display1:'none',table_display2:'none',
                        course:[],userID:userID})
            if(power == 1)//权限为1，打开student.ejs页面
                res.render('student',
                    {title:'student',successIsNot:'none' ,
                        table_display1:'none',table_display2:'none',table_display3:'none',
                        course:[],userID:userID})
            if(power == 2)//权限为2，打开admin.ejs页面
                res.render('admin',
                    {title:'admin',successIsNot:'none' ,
                        table_display1:'none',table_display2:'none',table_display3:'none',
                        course:[],userID:userID,student:[]
                    })
        }
        else {
            res.render('login',{title:'Login',successIsNot:'block'})
        }
    })
})

// 学生查看课程信息
router.post('/form_student_course',function (req,res) {
    myDB.courseFind('',function (result) {
        res.render('student',{title:'student', course:result, table_display1:'block',
            table_display2:'none',table_display3:'none'
        })
    })
})
// 学生查看已选课程表
router.post('/form_student_course_selected',function (req,res) {
    var userID
    if(req.cookies["account"] != null) {
        var account = req.cookies["account"]
        userID = account.account
        console.log('form_student_course_selected:  '+userID)
    }
    else{
        res.render('login',{ title: 'Express',successIsNot:'none' ,
            table_display1:'none',table_display2:'none',
            course:[],userID:'',table_display3:'none'});
    }

    myDB.studentFind(userID,function (result) {
        result.forEach(function (row) {
            myDB.courseFind(row.courseId,function (course) {
                res.render('student',
                    {title:'student', course:course,
                        table_display1:'none',table_display2:'block',table_display3:'none'})
            })
        })

    })
})

// 学生修改密码
router.post('/form_student_password',function (req,res) {
    var userID
    var hash
    var power
    if(req.cookies["account"] != null) {
        var account = req.cookies["account"]
        userID = account.account
        hash = account.hash
        power = account.power
         console.log('验证密码')
        if(hashPW(userID,req.body.oldPassword) == hash){
            console.log('密码输入成功')
            myDB.passwordRevise(power,userID,req.body.newPassword)
        }
        else {
            console.log('密码验证失败')
        }
    }
    res.render('student',{title:'student', course:[], table_display1:'none',
        table_display2:'none',table_display3:'block'
    })
})

// 管理员查看学生信息
router.post('/form_admin_student',function (req,res) {
    myDB.studentFindAll(function (result) {
        console.log(result)
        res.render('admin',{student:result,title:'student', course:[], table_display1:'block',
            table_display2:'none',table_display3:'none'
        })
    })
})
module.exports = router;
