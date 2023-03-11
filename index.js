const date_format = require('date-format');
const log4js = require("log4js");
const logger = log4js.getLogger();

const ini = require('ini');
const fs = require("fs");

const file_config="config.ini";

const shared_memory = require("../shared-memory-js-v4");
const {Controller, TagList, Tag, Structure, util} = require('st-ethernet-ip');

var config={
    'ReadConfigEvery':100,
    "FileLog":"ON",
    "ConsoleLog":"ON",
    "BusyDealy":"OFF",
    "EndCycle":"NO",
    "LogReadCONFIG":"OFF",
    "LogPLCReadArray01":"OFF",
    "LogPLCReadMinMax":"OFF",
    "LogArray01Value":"OFF",
    "LogPLCWriteArray02":"OFF",
    "LogPLCWriteMinMax":"OFF",
    "LogArray02Value":"OFF",
    "LogMemory1Write":"OFF",
    "LogMemory2Read":"OFF",

    "Memory1Key":"MEMORY1",
    "Memory2Key":"MEMORY2",
    
    "logger":{
        "appenders": {
          "everything": {
            "type": "file",                
            "layout":{
                "type": "pattern",
                "pattern": "[%d] [%5.5p] %m%n"
            }
          }
        },
        "categories": {
          "default": { "appenders": [ "everything"], "level": "ALL" }
        }
      },

    "IpPLC":"11.200.2.83",
    "TimeoutSpForReadWrite":100, 
    "DelayIncreaseBeforeEachReconnect":10, 
    "DelayBeforeRead":0, 
    "DelayAfterRead":0,
    "DelayBeforeWrite":0, 
    "DelayAfterWrite":0,
    "ExpectedMaxTimeForRead":0,
    "ExpectedMaxTimeForWrite":0
    
}
let error_config_load='';
async function readConfigFile(){ 
  error_config_load='';  
  try {      
    
    let fileContents = fs.readFileSync(file_config, 'utf-8');    
    let config_from_file=ini.parse(fileContents);
    //CONFIGURATION
    if(config_from_file.CONFIGURATION.ReadConfigEvery){
      if(config_from_file.CONFIGURATION.ReadConfigEvery>0){
        config.ReadConfigEvery=Number(config_from_file.CONFIGURATION.ReadConfigEvery);
      }      
    }
    if(config_from_file.CONFIGURATION.FileLog){
      config.FileLog=config_from_file.CONFIGURATION.FileLog;
    }
    if(config_from_file.CONFIGURATION.ConsoleLog){
      config.ConsoleLog=config_from_file.CONFIGURATION.ConsoleLog;
    }
    if(config_from_file.CONFIGURATION.BusyDealy){
      config.BusyDealy=config_from_file.CONFIGURATION.BusyDealy;
    }
    if(config_from_file.CONFIGURATION.EndCycle){
      config.EndCycle=config_from_file.CONFIGURATION.EndCycle;
    }
    if(config_from_file.CONFIGURATION.LogReadCONFIG){
      config.LogReadCONFIG=config_from_file.CONFIGURATION.LogReadCONFIG;
    }
    if(config_from_file.CONFIGURATION.LogPLCReadArray01){
      config.LogPLCReadArray01=config_from_file.CONFIGURATION.LogPLCReadArray01;
    }
    if(config_from_file.CONFIGURATION.LogPLCReadMinMax){
      config.LogPLCReadMinMax=config_from_file.CONFIGURATION.LogPLCReadMinMax;
    }
    if(config_from_file.CONFIGURATION.LogArray01Value){
      config.LogArray01Value=config_from_file.CONFIGURATION.LogArray01Value;
    }
    if(config_from_file.CONFIGURATION.LogPLCWriteArray02){
      config.LogPLCWriteArray02=config_from_file.CONFIGURATION.LogPLCWriteArray02;
    }
    if(config_from_file.CONFIGURATION.LogArray02Value){
      config.LogArray02Value=config_from_file.CONFIGURATION.LogArray02Value;
    }
    if(config_from_file.CONFIGURATION.LogPLCWriteMinMax){
      config.LogPLCWriteMinMax=config_from_file.CONFIGURATION.LogPLCWriteMinMax;
    }
    if(config_from_file.CONFIGURATION.LogMemory1Write){
      config.LogMemory1Write=config_from_file.CONFIGURATION.LogMemory1Write;
    }
    if(config_from_file.CONFIGURATION.LogMemory2Read){
      config.LogMemory2Read=config_from_file.CONFIGURATION.LogMemory2Read;
    }
    //SHAREDMEMORY
    if(config_from_file.SHAREDMEMORY.Memory1Key){
      config.Memory1Key=config_from_file.SHAREDMEMORY.Memory1Key;
    }  
    if(config_from_file.SHAREDMEMORY.Memory2Key){
      config.Memory2Key=config_from_file.SHAREDMEMORY.Memory2Key;
    } 
    //FILELOGGER
    if(config_from_file.FILELOGGER.FileLoggerPattern){
      config.logger.appenders.everything.layout.pattern=config_from_file.FILELOGGER.FileLoggerPattern;
    }
    //PLC
    if(config_from_file.PLC.IpPLC){
      config.IpPLC=config_from_file.PLC.IpPLC;
    }
    if(config_from_file.PLC.TimeoutSpForReadWrite){
      config.TimeoutSpForReadWrite=Number(config_from_file.PLC.TimeoutSpForReadWrite);
    }
      
    if(config_from_file.PLC.DelayIncreaseBeforeEachReconnect){
      config.DelayIncreaseBeforeEachReconnect=Number(config_from_file.PLC.DelayIncreaseBeforeEachReconnect);
    }  
    if(config_from_file.PLC.DelayBeforeRead){
      config.DelayBeforeRead=Number(config_from_file.PLC.DelayBeforeRead);
    }  
    if(config_from_file.PLC.DelayAfterRead){
      config.DelayAfterRead=Number(config_from_file.PLC.DelayAfterRead);
    }  
    if(config_from_file.PLC.DelayBeforeWrite){
      config.DelayBeforeWrite=Number(config_from_file.PLC.DelayBeforeWrite);
    }  
    if(config_from_file.PLC.DelayAfterWrite){
      config.DelayAfterWrite=Number(config_from_file.PLC.DelayAfterWrite);
    }
    if(config_from_file.PLC.ExpectedMaxTimeForRead){
      config.ExpectedMaxTimeForRead=Number(config_from_file.PLC.ExpectedMaxTimeForRead);
    }
    if(config_from_file.PLC.ExpectedMaxTimeForWrite){
      config.ExpectedMaxTimeForWrite=Number(config_from_file.PLC.ExpectedMaxTimeForWrite);
    }
  } catch (e) {    
    error_config_load=e;
  }  
}
var logFolderDate = new Date(); 
let logFolder = logFolderDate.getFullYear()+ "_" + ("0"+(logFolderDate.getMonth()+1)).slice(-2) + "_" +("0" + logFolderDate.getDate()).slice(-2)  
   +"_" + ("0" + logFolderDate.getHours()).slice(-2) + "_" + ("0" + logFolderDate.getMinutes()).slice(-2)+ "_" + ("0" + logFolderDate.getSeconds()).slice(-2);
let file_log4js_current=null;
function setLoggerFile(){
    var d = new Date();    
    var file_log4js = ("0" + d.getDate()).slice(-2) +"/" + ("0" + d.getHours()).slice(-2);
    if(file_log4js_current!=file_log4js){
    file_log4js_current=file_log4js;
    config.logger.appenders.everything.filename='logs/'+logFolder+'/'+file_log4js+'.log';
    log4js.configure(config.logger);
    }
}
//FileLoggerON='',ConsoleLoggerON='' take from config else use this
function logMessage(message,type='info',FileLog='',ConsoleLog='') {
    if(FileLog==''){
        FileLog=config.FileLog;
    }
    if(ConsoleLog==''){
        ConsoleLog=config.ConsoleLog;
    }
    if(FileLog=='ON'){
        setLoggerFile();        
        logger[type](message);         
    }
    if(ConsoleLog=='ON'){
        console.log('['+date_format(new Date())+'] ',message);  
    }  
}

//for first time
readConfigFile();
if(!error_config_load){
    logMessage('[CONFIG] Configuration file('+file_config+') loaded.');
}
else{
    logMessage('Configuration file('+file_config+' ) Error.','warn');  
    logMessage(error_config_load,'warn');
}

async function delay(ms){
    if(config.BusyDealy=="ON"){    
      var waitTill = new Date(new Date().getTime() + ms);
      while(waitTill > new Date()){}
    }
    else{
        await new Promise(res => setTimeout(res, ms));
    }
  }  
let cycle=0;
function updateConfig(){
    cycle++;
    if(cycle>config.ReadConfigEvery){
        cycle=0;
        if(config.LogReadCONFIG=='ON'){
          logMessage('[CONFIG] Reading Start Config File');
        }
        readConfigFile();
        if(config.LogReadCONFIG=='ON'){
          logMessage('[CONFIG] Reading End Config File');
        }
    }    
}

let PLC = null;
let taglist= null;
let attempt = 0;

let consecutive_reconnect=0;
let memory1=null;
let memory2=null;



async function connectPLC(){  
    if(consecutive_reconnect>0){
        logMessage('[PLC CONNECT] Waiting Before Reconnect: '+consecutive_reconnect*config.DelayIncreaseBeforeEachReconnect+'ms('+consecutive_reconnect+')');
        await delay(consecutive_reconnect*config.DelayIncreaseBeforeEachReconnect);  
    }
    attempt++;
    logMessage('[PLC CONNECT] Attempt: '+attempt,'info','','ON');    
    PLC = new Controller(); 
    try{    
      logMessage('[PLC CONNECT] Connecting with PLC: '+config.IpPLC);
      await PLC.connect(config.IpPLC);
      logMessage('[PLC CONNECT] Connected with PLC: '+config.IpPLC);  
      if(taglist==null){               
        logMessage('TagList: Start');
        await PLC.getControllerTagList(PLC.state.tagList);
        logMessage('TagList: Finished');       
        taglist = PLC.state.tagList;
      }
      else{
          PLC.state.tagList=taglist;
      }  
      consecutive_reconnect=0;               
      PLC.timeout_sp=config.TimeoutSpForReadWrite;          
    }catch(ex){
      logMessage('[PLC CONNECT] Failed to connect with PLC: '+config.IpPLC+' for following reason:','error');
      logMessage(ex,'error');
      await disconnectPLC();      
    }
}
async function disconnectPLC() {  
    if(PLC==null){
      logMessage('[PLC DISCONNECT] PLC not connected','warn');
    }
    else{
      try{ 
        logMessage('[PLC DISCONNECT] Disconnecting PLC');
        await PLC.disconnect(); 
        logMessage('[PLC DISCONNECT] Disconnected PLC');
      }catch(ex){
        logMessage('[PLC DISCONNECT] Failed disconnect PLC for following reason','error');    
        logMessage(ex,'error');
      }
    }
    PLC=null; 
    consecutive_reconnect++;   
}

let minimum_time_for_read=1000;
let maximum_time_for_read=0;
let exceed_read_counter=0;

let minimum_time_for_write=1000;
let maximum_time_for_write=0;
let exceed_write_counter=0;

async function start() {  
    //Creating Shared Memory. If failed Terminate Program
    try {
        logMessage('[M1 CREATE] Creating '+config.Memory1Key);
        memory1=shared_memory.createMemory(config.Memory1Key);
        logMessage('[M1 CREATE] Created '+config.Memory1Key);  
    }catch(ex) {
        logMessage('[M1 CREATE] Failed to create'+config.Memory1Key,'fatal');
        logMessage(ex,'error');
        return;
    }
    try {
        logMessage('[M2 CREATE] Creating '+config.Memory2Key);
        memory2=shared_memory.createMemory(config.Memory2Key);
        logMessage('[M2 CREATE] Created '+config.Memory2Key);  
    }catch(ex) {
        logMessage('[M2 CREATE] Failed to create'+config.Memory2Key,'fatal');
        logMessage(ex,'error');
        return;
    }
    while(config.EndCycle!='YES'){
      updateConfig();
      await connectPLC();
      if(PLC==null){
          continue;
      }
      let array_01_value_previous=null;
      let array_02_value_previous=null;
      while(config.EndCycle!='YES'){
          updateConfig();          
          let array_01 = new Structure('Array_01',PLC.state.tagList);
          try{    
              if(config.DelayBeforeRead>0){
                if(config.LogPLCReadArray01=='ON'){
                  logMessage('[PLC READ] Waiting '+config.DelayBeforeRead+'ms Before Read.');
                }
                  await delay(config.DelayBeforeRead);
              }       
              if(config.LogPLCReadArray01=='ON'){
                logMessage('[PLC READ] Reading Start Array_01');       
              }
              let time_before_read= new Date(); 
              await PLC.readTag(array_01);
              let time_after_read= new Date();
              let time_difference=time_after_read-time_before_read;

              if(time_difference>maximum_time_for_read){
                maximum_time_for_read=time_difference;  
                if(config.LogPLCReadMinMax=='ON'){                  
                  logMessage('[PLC READ] [MAX TIME] '+date_format(time_after_read)+' - '+date_format(time_before_read)+' = '+maximum_time_for_read);                    
                }
              }
              if(time_difference<minimum_time_for_read){
                  minimum_time_for_read=time_difference   
                  if(config.LogPLCReadMinMax=='ON'){                
                    logMessage('[PLC READ] [MIN TIME] '+date_format(time_after_read)+' - '+date_format(time_before_read)+' = '+minimum_time_for_read);                    
                  }
              }
              if(time_difference>config.ExpectedMaxTimeForRead){                
                  exceed_read_counter++;
                  if(config.LogPLCReadMinMax=='ON'){ 
                    logMessage('[PLC READ] [EXCEED TIME] '+date_format(time_after_read)+' - '+date_format(time_before_read)+' = '+time_difference+'('+exceed_read_counter+')');                    
                    logMessage('[PLC READ] ulong_msCounter= '+array_01.value.ulong_msCounter);
                  }
              }
              if(config.LogPLCReadArray01=='ON'){
                logMessage('[PLC READ] Reading End Array_01.');
              }
              if(config.DelayAfterRead>0){
                if(config.LogPLCReadArray01=='ON'){
                  logMessage('[PLC READ] Waiting '+config.DelayAfterRead+'ms After Read.');
                }
                  await delay(config.DelayAfterRead);
              }  
          }
          catch(ex){   
              logMessage('[PLC READ] Failed to read Array_01','error');
              logMessage(ex,'error');
              await disconnectPLC();
              break;// PLC not alive start from reconnect
          }          
          let array_01_value_current=array_01.value;
          if(array_01_value_previous==null){ 
              array_01_value_previous=array_01_value_current;
              if(config.LogMemory1Write=='ON'){
                logMessage('[M1 WRITE] Writing Skipped Array_01 because first time.ulong_msCounter= '+array_01_value_previous.ulong_msCounter);
              }
          }
          else if(array_01_value_previous.ulong_msCounter ==array_01_value_current.ulong_msCounter){ 
            if(config.LogMemory1Write=='ON'){
              logMessage('[M1 WRITE] Writing Skipped Array_01 because ulong_msCounter is unchanged.ulong_msCounter= '+array_01_value_previous.ulong_msCounter);
            }
          }
          else{        
              array_01_value_previous=array_01_value_current;
              try{ 
                if(config.LogMemory1Write=='ON'){
                  logMessage('[M1 WRITE] Writing Start Array_01.ulong_msCounter= '+array_01_value_previous.ulong_msCounter);
                }
                  await shared_memory.writeArray01ToMemory(memory1,array_01_value_previous);
                if(config.LogMemory1Write=='ON'){
                  logMessage('[M1 WRITE] Writing End Array_01');
                }
              }
              catch(ex){
                  logMessage('[M1 WRITE] Failed to write Array_01','warn');
                  logMessage(ex,'warn');
              }          
          }
          let array_02_value_current=null;
          try{
            if(config.LogMemory2Read=='ON'){
              logMessage('[M2 READ] Reading Start Array_02');
            }
              array_02_value_current=shared_memory.readArray02FromMemory(memory2);
            if(config.LogMemory2Read=='ON'){
              logMessage('[M2 READ] Reading End Array_02');
            }
          }
          catch(ex){
              logMessage('[M2 Read] Failed to Read Array_02.Not Writing to PLC','warn');
              logMessage(ex,'warn');
          }          
          if(array_02_value_current!=null){
              if(array_02_value_previous==null){
                array_02_value_previous=array_02_value_current;
                if(config.LogPLCWriteArray02=='ON'){
                  logMessage('[PLC WRITE] Writing Skipped Array_02 because first time.uint_CMAlive= '+array_02_value_previous.uint_CMAlive );
                }
              }
              else if(array_02_value_previous.uint_CMAlive ==array_02_value_current.uint_CMAlive){
                if(config.LogPLCWriteArray02=='ON'){
                  logMessage('[PLC WRITE] Writing Skipped Array_02 because uint_CMAlive is unchanged.uint_CMAlive= '+array_02_value_previous.uint_CMAlive);
                }
              }
              else{          
                array_02_value_previous=array_02_value_current;
                let array_02 = new Structure('Array_02',PLC.state.tagList);
                array_02.value=array_02_value_previous;
                try{  
                  if(config.DelayBeforeWrite>0){
                    if(config.LogPLCWriteArray02=='ON'){
                      logMessage('[PLC WRITE] Waiting '+config.DelayBeforeWrite+'ms Before WRITE.');
                    }
                      await delay(config.DelayBeforeWrite);
                  } 
                  if(config.LogPLCWriteArray02=='ON'){  
                    logMessage('[PLC WRITE] Writing Start Array_02.uint_CMAlive= '+array_02_value_previous.uint_CMAlive);
                  }
                  let time_before_write=new Date(); 
                  await PLC.writeTag(array_02);
                  let time_after_write=new Date();
                  let time_difference=time_after_write-time_before_write;

                  if(time_difference>maximum_time_for_write){
                    maximum_time_for_write=time_difference;  
                    if(config.LogPLCWriteMinMax=='ON'){                  
                      logMessage('[PLC WRITE] [MAX TIME] '+date_format(time_after_write)+' - '+date_format(time_before_write)+' = '+maximum_time_for_write);                    
                    }
                  }
                  if(time_difference<minimum_time_for_write){
                    minimum_time_for_write=time_difference   
                      if(config.LogPLCWriteMinMax=='ON'){                
                        logMessage('[PLC WRITE] [MIN TIME] '+date_format(time_after_write)+' - '+date_format(time_before_write)+' = '+minimum_time_for_write);                    
                      }
                  }
                  if(time_difference>config.ExpectedMaxTimeForWrite){                
                    exceed_write_counter++;
                      if(config.LogPLCWriteMinMax=='ON'){ 
                        logMessage('[PLC WRITE] [EXCEED TIME] '+date_format(time_after_write)+' - '+date_format(time_before_write)+' = '+time_difference+'('+exceed_write_counter+')');                    
                        logMessage('[PLC WRITE] uint_CMAlive= '+array_02_value_previous.uint_CMAlive);
                      }
                  }
                  if(config.LogPLCWriteArray02=='ON'){
                    logMessage('[PLC WRITE] Writing End Array_02'); 
                  }
                  if(config.DelayAfterWrite>0){
                    if(config.LogPLCWriteArray02=='ON'){
                      logMessage('[PLC WRITE] Waiting '+config.DelayAfterWrite+'ms After WRITE.');
                    }
                      await delay(config.DelayAfterWrite);
                  }                   
                }
                catch(ex){    
                  logMessage('[PLC WRITE] Failed to write Array_02','error');
                  logMessage(ex,'error');
                  await disconnectPLC(PLC);
                  break;// PLC not alive start from reconnect
                }          
              }
          }
          if(config.LogArray01Value=='ON'){
            logMessage('[ARRAY01 VALUE] value of Array_01:');
            logMessage(array_01_value_previous); 
          }
          if(config.LogArray02Value=='ON'){
            logMessage('[ARRAY02 VALUE] value of Array_02:');
            logMessage(array_02_value_previous);
          }
      }
    }
}
async function end(){
    config.EndCycle="YES";
    await disconnectPLC();
    if(memory1){
        shared_memory.closeMemory(memory1);
    }
    if(memory2){
        shared_memory.closeMemory(memory2);
    }    
    process.exit();
}  
process.on( "SIGINT", function() {  
    console.log("ctr+c. Closing Program.");
    end();
    
});
process.on( 'beforeExit', function() {
    console.log("Terminating Program.");
    end();
});
start();


