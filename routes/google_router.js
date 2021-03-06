var bodyParser = require('body-parser');
var google_util = require('../src/api/cp_google/google_util.js');
var initGoogle = require('../src/api/cp_google/google_init');
var google_file_list = require('../models/googlefilelist');

module.exports = function(app)
{
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.post('/api/google/set/', function(req, res){
    var Accesstoken = req.body.CP_love;
    var userId =req.body.userId;
    initGoogle(Accesstoken,function(oauth2Client){
      google_util.setFilelist(Accesstoken, oauth2Client,userId, function(result){
        res.json({result: result});
        });
    });
  });

  app.post('/api/google/relieve/', function(req, res){
    // var Accesstoken = req.body.CP_love;
    var userId =req.body.userId;
    google_util.deleteUserData(userId, function(result){
      res.json({result: result});
    });
  });

  app.post('/api/google/refresh/list/', function(req, res){
    var userId = req.body.userId;
    google_file_list.find({"user_id":userId},{accesstoken:1,_id:0,} ,function(err, user){
      if(err){
        res.json('db error');
      }
      else{
        initGoogle(user[0].accesstoken,function(oauth2Client){
          google_util.setFilelist(user[0].accesstoken, oauth2Client,userId,function(result){
            console.log('refresh result : ',result);
            res.json(result); 
          });
        });      
      }
    });
  });
  
  app.post('/api/google/getBreadCrumbs/', function(req, res){
    var userId=req.body.userId;
    var folderId=req.body.folderId;
    console.log('folderId',folderId);
    google_util.getBreadCrumbs(userId,folderId,function(fileList,fileNameList){
      var FileList=[];
      FileList.push(fileList);
      FileList.push(fileNameList);
      res.json(JSON.stringify(FileList));
    });
  });


  app.post('/api/google/check/', function(req, res){
    var keyWord =req.body.keyWord;
    var orderKey='type';
    var keyType= req.body.keyType;
    var folderId=req.body.folderId;
    var userId=req.body.userId;
    google_util.searchFilelist(userId,folderId,keyWord,orderKey,keyType,function(fileList){
      res.json(JSON.stringify(fileList));
    });
  });

  app.post('/api/google/refresh/token', function(req, res){
    console.log('refresh 진입');
    var userId = '0000000001';
    // var userId = req.body.user_id;
    // var Accesstoken = req.body.accesstoken;
    var Accesstoken = ' ya29.GlsFBmT8krcZePQaytMF5guCO1Hjm1RtqotPDceU0-bKcXTVUEsojxt8eokzCeaZH54W454VypR2Qny7RukSVs8pp_RqcZ4_Tx_VXR8sjXWlCrkUaFpuPcreeWZr';
    google_util.refreshToken(userId, Accesstoken, function(result){
      console.log('google refresh token result : '+result);
      res.json(result);
    })
  });

  app.post('/api/google/rename', function(req, res){
    console.log('rest api 라우터 진입 ');
    var userId = req.body.userId;
    var fileId = req.body.fileId;
    var newName = req.body.newName;
    google_file_list.find({"user_id":userId},{accesstoken:1,_id:0,} ,function(err, user){
      if(err){
        res.json('db error');
      }
      else{
        initGoogle(user[0].accesstoken,function(oauth2Client){
          google_util.reName(userId,oauth2Client,fileId,newName,function(result){
            console.log('rename result : ',result);
            res.json(result); 
          });
        });      
      }
    });
  })

  app.post('/api/google/delete', function(req, res){
    console.log('rest api 라우터 진입 ');
    var userId = req.body.userId;
    var fileId = req.body.fileId;
    google_file_list.find({"user_id":userId},{accesstoken:1,_id:0,} ,function(err, user){
      if(err){
        res.json('db error');
      }
      else{
        initGoogle(user[0].accesstoken,function(oauth2Client){
          google_util.deleteFile(userId,oauth2Client,fileId,function(result){
            console.log('delete result : ',result);
            res.json(result); 
          });
        });      
      }
    });
  });

  app.post('/api/google/upload/', function(req, res){
    console.log('rest api 라우터 진입 ');
    var userId = req.body.userId;
    var newFile = req.body.newFile;
    console.log(req.body);

    google_util.uploadFile(userId,newFile,function(result){
      console.log('upload result : ',result);
      res.json(result); 
    });
  })

  app.post('/api/google/download/', function(req, res){
    console.log('rest api 라우터 진입 ');
    var userId = req.body.userId;
    var fileId = req.body.fileId;
    console.log(req.body);
    google_util.downloadFile(userId,fileId,function(result){
      console.log('download result : ',result);
      res.json(result); 
    });
  })


  app.post('/api/google/mvdir/', function(req, res){
    console.log('rest api 라우터 진입 ');
    console.log(req.body);
    var userId = req.body.userId;
    var fileId = req.body.fileId;
    var folderId = req.body.folderId;
    var CurfolderId = req.body.CurfolderId;
    
    if(fileId!=undefined&&folderId!=undefined){
      google_file_list.find({"user_id":userId},{accesstoken:1,_id:0,} ,function(err, user){
        if(err){
          res.json('db error');
        }
        else{
          initGoogle(user[0].accesstoken,function(oauth2Client){
            google_util.moveDir(userId,oauth2Client,fileId,folderId,CurfolderId,function(result){
              console.log('rename result : ',result);
              res.json(result); 
            });
          });      
        }
      });
    }
  })



  // var data = { "userId" : userId , "fileId": fileId, "folderId" : folderId, "newName":newName};
  // request.post({


// var Accesstoken=' ya29.Glz-Bb1LH__GuQFbCsx4LQUt_lISjDSfTUQPxvAuv4IN19O0Zpma8m1-tBVgCAJeox4b8I9L1Fsa79-kSXQyhbACrKMnhfORBO-nXCLrvcGY9SgF8mAwjq0ZYaPCqg';
// initGoogle(Accesstoken,function(oauth2Client){
//   google_util.addFilelist(oauth2Client,userId,folderId,function(result){
//     console.log(result,' file(s) added');
//   });
// });      


  // app.get('/api/google/add/', function(req, res){
  //   // var keyWord =req.body.keyWord;
  //   // var orderKey;//='name';
  //   // var keyType= req.body.keyType;
  //   var Accesstoken='ya29.Glz9BXQ-N1ZBtI3L-xj_lhbG2WDcOIlZVAqYbcI7O2Q_jS-poK6z1NdBJLl6zWX7vSDQY-3jB25QeUi0spx4m2jWpttVv0TryuVR-Iyd7F9UOEQkfOuq3KmTDH5H7g';
  //   var userId="lee";
  //   var folderDepth=0;
  //   //이부분은 accesstoken을 불러오는걸로 

  //   initGoogle(Accesstoken,function(oauth2Client){
  //     google_util.addFilelist(oauth2Client,userId,folderDepth+2,function(result){
  //       console.log(result,' file(s) added');
  //     });
  //   });

  // });

}
