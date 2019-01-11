#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May  9 23:11:30 2018

@author: Conory
"""
i=1;
while(i<=241):
    print(str(round((i-1)/2.4,2))+'%{background-image:url(../img/gif/'+str(i)+'.jpg);}')
    i+=1;