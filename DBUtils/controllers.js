const mongo = require('mongodb')
const url = 'mongodb://Sizer:Sizer57563@ac-nykjus7-shard-00-00.artwely.mongodb.net:27017,ac-nykjus7-shard-00-01.artwely.mongodb.net:27017,ac-nykjus7-shard-00-02.artwely.mongodb.net:27017/?ssl=true&replicaSet=atlas-67vtu3-shard-0&authSource=admin&retryWrites=true&w=majority'
getAll = (req, res) =>{
   var query
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            const user = req.body.userDetail.userType
            if(user=="user"){
                query = { customerManager: req.body.userDetail.email }
            }
            if(user=="admin"){
                query={}
            }
            console.log(query)
            const db = connection.db("Sizer")
            db.collection("customers").find(query).toArray((err, result)=>{
                if(err){
                    console.warn(err)
                }else{
                    //console.log(result)
                    if(req.body.userDetail.userType=="admin"){
                        db.collection("users").find({}).toArray((error, uresult)=>{
                            if(error){
                                console.warn(error)
                            }
                            else{
                                res.status(200).json({
                                    message:result,
                                    allUsers:uresult
                                   })
                                   connection.close()
                            }
                        })
                    }
                    else{
                    res.status(200).json({
                        message:result
                       })
                       connection.close()
                    }
                }
            })
        }
    })
}
saveMeasurement = (req, res) =>{
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            var measurement={}
            measurement.kaftan = req.body
            const db = connection.db("Sizer")
            db.collection("customers").
           updateOne({phone:req.body.owner},{$set:{measurement:measurement}},(err, result)=>{
            if(err){
                console.log(err)
            }
            else{
                res.status(200).json({
                    message:"measurement saved successfully"
                })
            }
            
           })
        }
    })
}

updateMeasurement = (req, res) =>{
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            var measurement={}
            measurement.kaftan = req.body
            const db = connection.db("Sizer")
            db.collection("customers").
           updateOne({phone:req.body.owner},{$set:{measurement:measurement}},(err, result)=>{
            if(err){
                console.log(err)
            }
            else{
                res.status(200).json({
                    message:"measurement saved successfully"
                })
            }
            
           })
        }
    })
}

signUp = (req, res) =>{
    var approval
    var userType
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            const db = connection.db("Sizer")
            db.collection("users")
            .countDocuments({$or:[{email:req.body.email}, {phone:req.body.phone}]},(err, result)=>{
                if(err){
                    console.log(err)
                }else{
                    if(result == 0){
                        db.collection("users")
                        .countDocuments({}, (error, result)=>{
                            if(error){
                                console.log(error)
                            }else{
                                if(result > 0){
                                    approval = "not approved"
                                    userType = "user"
                                    const body = req.body
                                    body.approval = approval
                                    body.userType = userType
                                    db.collection("users")
                                    .insertOne(body, (error, result)=>{
                                        if(error){
                                            res.status(500).json({
                                                message:"srever error: " + error
                                            })
                                        }else{
                                            res.status(201).json({
                                                message:"user created successfully"
                                            })
                                        }
                                    })
                                }else{
                                    approval = "approved"
                                    userType="admin"
                                    const body = req.body
                                    body.approval = approval
                                    body.userType = userType
                                    db.collection("users")
                                    .insertOne(body, (error, result)=>{
                                        if(error){
                                            res.status(500).json({
                                                message:"server error: " + error
                                            })
                                        }else{
                                            res.status(201).json({
                                                message:"admin created successfully"
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        res.status(409).json({
                            message:"email or password already exist"
                        })
                    }
                }
            })
            

        }
})
}
LogIn = (req, res) =>{
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            const db = connection.db("Sizer")
            db.collection("users")
            .findOne({$or:[{email:req.body.email}, {phone:req.body.email}]},(error, result)=>{
                if(error){
                    res.status(500).json({
                        message:"server error :" + error,
                        status:500
                    })
                }
                if(result != null){
                    if(result.password != req.body.password){
                        res.status(203).json({
                            message:"password is not correct",
                            status:203
                        })
                    }
                    if(result.approval != "approved"){
                        res.status(203).json({
                            message:"inactive user",
                            status:203
                        })
                    }
                    if(result.password == req.body.password && result.approval == "approved"){
                        if(result.userType == "admin"){
                            db.collection("customers").find({}).toArray((error, cresult)=>{
                                if(error){
                                    console.warn(error)
                                }
                                else{
                                    db.collection("users").find({}).toArray((error, uresult)=>{
                                        if(error){
                                            console.warn(error)
                                        }
                                        else{
                                            res.status(200).json({
                                                message:"login successful",
                                                status:200,
                                                userEmail:req.body.email,
                                                userDetails:result,
                                                customers:cresult,
                                                allUsers:uresult
                                            })
                                        }
                                    })
                                    
                                }
                            })
                        }
                        else{
                            res.status(200).json({
                                message:"login successful",
                                status:200,
                                userEmail:req.body.email,
                                userDetails:result
                            })
                        }
                    }
                   
                }else{
                    res.status(203).json({
                        message:"email or phone number invalid",
                        status:203
                    })
                }
            })
        }
    })
}

createCustomer = (req, res) =>{
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            const db = connection.db("Sizer")
            db.collection("customers")
            .countDocuments({phone:req.body.phone},(err, result)=>{
                if(err){
                    console.log(err)
                }else{
                    if(result == 0){
                                    db.collection("customers")
                                    .insertOne(req.body, (error, result)=>{
                                        if(error){
                                            res.status(500).json({
                                                message:"server error: " + error
                                            })
                                        }else{
                                            res.status(201).json({
                                                message:"customer created successfully",
                                                status:201
                                            })
                                        }
                                    })
                    }else{
                        res.status(409).json({
                            message:"customer with this phone number already exist"
                        })
                    }
                }
            })
            

        }
})
}
tendUser = (req, res) =>{
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            const db = connection.db("Sizer")
            db.collection("users")
            .updateOne({phone:req.body.phone},{$set:{approval:req.body.action}},(err, result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.status(200).json({
                        message:"successful",
                        status:200
                    })
                }
                
               })
        }
})
}
deleteUser = (req, res) =>{
    mongo.MongoClient.connect(url, (err, connection)=>{
        if(err){
            console.log(err)
        }else{
            const db = connection.db("Sizer")
            db.collection("users")
            .deleteOne({phone:req.body.phone},(err, result)=>{
                console.warn(req.body.phone)
                if(err){
                    console.log(err)
                }
                else{
                    res.status(200).json({
                        message:"deleted successfully",
                        status:200
                    })
                }
                
               })
        }
})
}

module.exports = {
    getAll,
    saveMeasurement,
    signUp,
    LogIn,
    createCustomer,
    updateMeasurement,
    tendUser,
    deleteUser
}
