import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Button } from "@mui/material";
import axios from 'axios';
import consts from '../../manager/consts';
import {FileDownload, Verified, GppBad} from '@mui/icons-material';

function FileComponent(props) {
  const { fileInfo } = props;

  const [file, setFileData] = useState({});

  const handleDownload = async () => {
    try {
        const url = consts.API_URL + `files/${file.fileId}` ; // Replace with your API endpoint
        
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Bearer ${file.token}`
            }
        });
        const blob = new Blob([response.data]/*, { type: 'application/pdf' }*/);
        const urlDownload = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlDownload;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error)
      if (error?.response?.status === 401){
        localStorage.removeItem("token")
      }
        console.error('Error downloading files:', error);
    }
  };

  
  const handleVerify = async () => {
    try {
      console.log(file)
        const url = consts.API_URL + `files/${file.fileId}` ; // Replace with your API endpoint

        axios.post(url, {fileHash: file.fileHash, fileName:file.fileName}).then(
          function (response){
            if (response.data){
              setFileData({ ...file, isVerified: response.data.isVerified, needVerify: false})
            }
          }
        ).catch(
          function (error){
            console.log(error);
          }
        );

    } catch (error) {
      if (error?.response.status === 401){
        localStorage.removeItem("token")
      }
        console.error('Error downloading files:', error);
    }
  };

  useEffect(() => {
    if (fileInfo) {
    setFileData({
        token: localStorage.getItem("token"),
        fileHash: fileInfo.fileHash,
        fileName: fileInfo.fileName,
        fileId: fileInfo.id,
        needVerify: true,
        isVerified: false
      });
    }
  }, [file.id]);

  useEffect(() => {
    if (file.fileId != undefined){
      handleVerify()
    }
  },[file.fileId])

  return (
    <div>
        <a> {file.fileName} </a>
        {file.token && file.isVerified && (<Button onClick={handleDownload} > <FileDownload></FileDownload> </Button>)}
        {file.needVerify && (<Button variant="outlined" color="success" onClick={handleVerify}> Verify </Button>)}
        {file.isVerified && (<Verified color="success"></Verified>)}
        {(!file.isVerified && !file.needVerify) && (<GppBad color="error"></GppBad>)}
    </div>   
  );
}

export default FileComponent;
