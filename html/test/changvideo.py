#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May  9 22:08:14 2018

@author: Conory
"""

import cv2
vc=cv2.VideoCapture('video/1.mp4')
c=1;
if vc.isOpened():
    rval,frame=vc.read()
else:
    rval=False
while rval:
    rval,frame=vc.read()
    cv2.imwrite('img/gif1/'+str(c)+'.jpg',frame,[int(cv2.IMWRITE_JPEG_QUALITY), 50])
    c=c+1
    cv2.waitKey(1)
vc.release()