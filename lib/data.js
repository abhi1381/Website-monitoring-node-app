/*
* library used for editing and storing data from server
*
*
*/

// Dependencies 
var fs = require('fs');
var path = require('path');

// module to be exported
var lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// write data to the file
lib.create = function(dir,file,data,callback) {
    // open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json` , 'wx', function(err,fileDescriptor) {
        if(!err && fileDescriptor) {
            // convert data to string
            var stringData = JSON.stringify(data);

            // write to file and close it
            fs.writeFile(fileDescriptor,stringData,function(err) {
                if(!err) {
                    fs.close(fileDescriptor,function(err) {
                        if(!err) {
                            callback(false);
                        } else {
                            callback('error closing new file');
                        }
                    })
                } else {
                    callback('error writing to new file');
                }
            })
        } else {
            callback('could not create new file , it may already exist');
        }
    })
}

// read data from the file
lib.read = function(dir,file,callback) {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`,'utf-8',function(err,data) {
        callback(err,data);
    })
}

// update data inside the file 
lib.update = function(dir,file,data,callback) {
    // open file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`,'r+',function(err,fileDescriptor) {
        if(!err && fileDescriptor) {
            // convert data to string
            var stringData = JSON.stringify(data);

            // truncate the file
            fs.truncate(fileDescriptor,function(err) {
                if(!err) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,function(err) {
                        if(!err) {
                            fs.close(fileDescriptor,function(err) {
                                if(!err) {
                                    callback(false);
                                } else {
                                    callback('error closing existing file');
                                }
                            })
                        } else {
                            callback('error writing to existing file')
                        }
                    })

                } else {
                    callback('err truncating the file');
                }
            })
            
        } else {
            callback('couuld not open and update the file , it may not exist yet');
        }
    })
}

// Delete a file
lib.delete = function(dir,file,callback){

    // Unlink the file from the filesystem
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
      if(!err) {
          callback(false);
      } else {
          callback('error deleting file');
      }
    });
  
  };
    


// export
module.exports = lib;





