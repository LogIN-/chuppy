/* 
 * @Author: LogIN
 * @Date:   2014-08-21 10:44:30
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-31 13:43:51
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-21 10:44:30 The Chuppy Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// Set global variable for Jslint
/* global Chuppy */
// Common functions
Chuppy.Utils.Functions = {
    //  Converts form elements to a valid JSON object 
    serilizeObject: function(form) {
        "use strict";
        var result = {};
        var extend = function(i, element) {
            var node = result[element.name];
            // If node with same name exists already, need to convert it to an array as it
            // is a multi-value field (i.e., checkboxes)

            if ('undefined' !== typeof node && node !== null) {
                if ($.isArray(node)) {
                    node.push(element.value);
                } else {
                    result[element.name] = [node, element.value];
                }
            } else {
                result[element.name] = element.value;
            }
        };

        $.each(form.serializeArray(), extend);
        return result;
    },
    // Is number ?? 
    // http://dl.getdropbox.com/u/35146/js/tests/isNumber.html
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    findExtension: function(string) {
        var ext = path.extname(string || '').split('.');
        return ext[ext.length - 1];
    },

    findExtensionIcon: function(extension, type) {
        var iconDefault;
        var icon;
        // If its directory?  
        if (type === 1) {
            iconDefault = "folder";
        } else if (type === 0) {
            icon = "lib/images/system-icons/extensions/" + extension + ".png";
            iconDefault = "file";
        }
        if (type === 0 && Chuppy.Utils.FileSystem.existsSync(icon)) {
            return extension;
        } else {
            return iconDefault;
        }

    },
    /**
     * @function: humanSize()
     * @purpose: Converts bytes to the most simplified unit.
     * @param bytes (number)
     * @param useSI (boolean), if true then uses SI standard (1KB = 1000bytes), otherwise uses IEC (1KiB = 1024 bytes)
     * @param precision (number), sets the maximum length of decimal places.
     * @param useSISuffix (boolean), if true forces the suffix to be in SI standard. Useful if you want 1KB = 1024 bytes
     * @returns (string), represents bytes is the most simplified form.
     */
    humanSize: function(bytes, useSI, precision, useSISuffix) {
        "use strict";
        if (!(!isNaN(bytes) && +bytes > -1 && isFinite(bytes))) {
            return false;
        }
        var units, obj, amountOfUnits, unitSelected, suffix;
        units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        obj = {
            base: useSI ? 10 : 2,
            unitDegreeDiff: useSI ? 3 : 10
        };
        amountOfUnits = Math.max(0, Math.floor(Math.round(Math.log(+bytes) / Math.log(obj.base) * 1e6) / 1e6));
        unitSelected = Math.floor(amountOfUnits / obj.unitDegreeDiff);
        unitSelected = units.length > unitSelected ? unitSelected : units.length - 1;
        suffix = (useSI || useSISuffix) ? units[unitSelected] : units[unitSelected].replace('B', 'iB');
        bytes = +bytes / Math.pow(obj.base, obj.unitDegreeDiff * unitSelected);
        precision = precision || 2;
        if (bytes.toString().length > bytes.toFixed(precision).toString().length) {
            bytes = bytes.toFixed(precision);
        }
        return bytes + " " + suffix;
    },
    /**
     * Global function for playing a sound
     *
     * @param String name Sound name
     * @param float volume Sound volume (0.0 - 1.0)
     * @return DOMAudio
     */
    doPlaySound: function(file, volume) {
        if (typeof volume === 'undefined') {
            volume = 1;
        }
        console.info('doPlaySound()', file);
        var audio = new Audio(file);
        audio.volume = volume;
        audio.play();
    }
};
