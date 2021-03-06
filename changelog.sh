#!/bin/bash
# @Author: LogIN
# @Date:   2014-08-22 20:09:24
# @Email:  unicoart@gmail.com
# @URL:    https://github.com/LogIN-/chuppy
# @Last Modified by:   LogIN
# @Last Modified time: 2014-08-28 11:07:58
# Use of this source code is governed by a license: 
# The MIT License (MIT)
# 
# Copyright (c) 2014-08-22 20:09:24 The Chuppy Authors
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

# git log 0.1.0-alpha..HEAD --no-merges --format=%B > CHANGELOG.TXT
git log --no-merges --format=%B > CHANGELOG.TXT