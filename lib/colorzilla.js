
//
// This file is part of ColorZilla
//
// Written by Alex Sirota (alex @ iosart.com)
//
// Copyright (c) iosart labs llc 2011, All Rights Reserved
//
var cz = exports;

cz.HSVTriple = function(h, s, v) {
	this.h = h;
	this.s = s;
	this.v = v;

	this.toString = function () {
		return "(" + this.h + ", " + this.s + ", " + this.v + ")";
	}
}

cz.HSLTriple = function(h, s, l) {
	this.h = h;
	this.s = s;
	this.l = l;

	this.toString = function () {
		return "(" + this.h + ", " + this.s + ", " + this.l + ")";
	}
}

cz.RGBTriple = function(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;

	this.toString = function () {
		return "(" + this.r + ", " + this.g + ", " + this.b + ")";
	}
}

cz.LABTriple = function(l, a, b) {
	this.l = l;
	this.a = a;
	this.b = b;

	this.toString = function () {
		return "(" + this.l + ", " + this.a + ", " + this.b + ")";
	}
}

cz.XYZTriple = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.toString = function () {
		return "(" + this.x + ", " + this.y + ", " + this.z + ")";
	}
}

cz.CMYKQuadruple = function(c, m, y, k) {
	this.c = c;
	this.m = m;
	this.y = y;
	this.k = k;

	this.toString = function () {
		return "(" + this.c + ", " + this.m + ", " + this.y + ", " + this.k + ")";
	}
}

// RGB -> COLORREF
cz.RGBToColor = function(r, g, b) {
	return r | (g << 8) | (b << 16);
}

// COLORREF -> R/G/B:
cz.GetRValue = function(color) {
	return color & 0xff;
}

cz.GetGValue = function(color) {
	return (color >> 8) & 0xff;
}

cz.GetBValue = function(color) {
	return (color >> 16) & 0xff;
}

// 0..255 -> 0% - 100%
cz.IntToPercent = function(val) {
	return Math.floor(((val * 100) / 255) + 0.5);
}

// 0..255 -> 0-360
cz.IntToDegrees = function(val) {
	return Math.floor(((val * 360) / 255) + 0.5);
}

// 0..255 -> 00 - ff 
cz.DecimalToHexa = function(val) {
	var hexStr = val.toString(16);
	if (hexStr.length < 2) {
		hexStr = "0" + hexStr;
	}
	return hexStr;
}

// COLORREF -> rgb(100%, 100%, 100%)
cz.ColToRGBPercentageAttribute = function(col) {
 	var colStr = cz.IntToPercent(cz.GetRValue(col)) + "%, " +
			cz.IntToPercent(cz.GetGValue(col)) + "%, " +
			cz.IntToPercent(cz.GetBValue(col)) + "%";
	return "rgb(" + colStr + ")";
}

// COLORREF -> hsl(240, 100%, 100%)
cz.ColToHSLAttribute = function(col) {
        var hsl = cz.RGBToHSL(cz.GetRValue(col), cz.GetGValue(col), cz.GetBValue(col));

 	var colStr =     hsl.h + ", " +
                     cz.IntToPercent(hsl.s) + "%, " +
                     cz.IntToPercent(hsl.l) + "%";
	return "hsl(" + colStr + ")";
}

// COLORREF -> rgb(255, 255, 255)
cz.ColToRGBAttribute = function(col) {
 	var colStr = cz.GetRValue(col) + ", " + cz.GetGValue(col) + ", " + cz.GetBValue(col);
	return "rgb(" + colStr + ")";
}

// rgb(255, 255, 255) -> COLORREF
cz.RGBAttributeToCol = function(colAttribute) {
	var firstParen = colAttribute.split("(");
	colAttribute = firstParen[1];
	var secondParen = colAttribute.split(")");
	colAttribute = secondParen[0];
	var rgbArr = colAttribute.split(",");
	return cz.RGBToColor(rgbArr[0], rgbArr[1], rgbArr[2]);
}


// COLORREF -> #ffffff
cz.ColToRGBHexaAttribute = function(col) {
 	var colStr = cz.DecimalToHexa(cz.GetRValue(col)) +
			cz.DecimalToHexa(cz.GetGValue(col)) +
			cz.DecimalToHexa(cz.GetBValue(col));
	if (!cz.gbCZLowerCaseHexa) {
		colStr = colStr.toUpperCase();
	}
	return "#" + colStr;
}

// #ffffff -> COLORREF
// assumev valid string
cz.RGBHexaAttributeToCol = function(col) {
	var red   = col.substr(1, 2);
	var green = col.substr(3, 2);
	var blue  = col.substr(5, 2);

	red   = parseInt(red, 16);
	green = parseInt(green, 16);
	blue  = parseInt(blue, 16);

	return cz.RGBToColor(red, green, blue);
}

cz.RGBToGrayscale = function(r, g, b) {
	return (r * 0.30) + (g * 0.59) + (b * 0.11);
}

// COLORREF -> rgb/rgb-perc/hsl/hex-no-hash/hex
cz.ColToSpecificColorFormat = function(colorRef, colorFormat) {
   var colorStr;
   switch (colorFormat) {
       case 'rgb':
           colorStr = cz.ColToRGBAttribute(colorRef);
           break;
       case 'rgb-perc':
           colorStr = cz.ColToRGBPercentageAttribute(colorRef);
           break;
       case 'hsl':
           colorStr = cz.ColToHSLAttribute(colorRef);
           break;
      case 'hex-no-hash':
           colorStr = cz.ColToRGBHexaAttribute(colorRef);
           colorStr = colorStr.substring(1);
           break;
       case 'hex':
           colorStr = cz.ColToRGBHexaAttribute(colorRef);
           break;
       default:
           colorStr = cz.ColToRGBHexaAttribute(colorRef);
   }
   return colorStr;
}

cz.RGBToHSV = function(r, g, b) {
	var hue, sat, val;
	var max, dif;

	max = Math.max(r, g, b);
	dif = max - Math.min(r, g, b);
	sat = (max == 0) ? 0 : (255 * dif/max);

	if (sat == 0) {
		hue=0;
	} else if (r == max) {
		hue = 60.0 * (g - b) / dif;
	} else if (g == max) {
		hue = 120.0 + 60.0*(b - r) / dif;
	} else if (b == max) {
		hue = 240.0 + 60.0*(r - g) / dif;
	}

	if (hue < 0.0) {
		hue += 360.0;
	}
	hue = Math.round((hue * 255.0) / 360.0);
	sat = Math.round(sat);

	val = max;
	return new cz.HSVTriple(hue, sat, val)
}


cz.RGBToHSL = function(r, g, b) {
    r /= 255;
    g /= 255; 
    b /= 255;
    
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    var l = (max + min) / 2;

    var h, s;
 
    if (max == min) {
         h = s = 0; 
    } else{
         var delta = max - min;
         s = delta / ((l > 0.5) ? (2 - max - min) : (max + min));
         switch (max) {
             case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
             case g: h = (b - r) / delta + 2; break;
             case b: h = (r - g) / delta + 4; break;
         }
         h /= 6;
    }

    h = Math.round(h * 360);
	s = Math.round(s * 255);
	l = Math.round(l * 255);
 
    return new cz.HSLTriple(h, s, l);
}

// http://en.wikipedia.org/wiki/SRGB_color_space
cz.RGBToXYZ = function(r, g, b) {
    r /= 255;
    g /= 255; 
    b /= 255;

    function norm(x) {
        return (x > 0.04045) ? Math.pow( ((x + 0.055) / 1.055), 2.4) : (x / 12.92);
    }

    r = norm(r);
    g = norm(g);
    b = norm(b);
    
    var x = 0.4124*r  + 0.3576*g  + 0.1805*b;
    var y = 0.2126*r  + 0.7152*g  + 0.0722*b;
    var z = 0.0193*r  + 0.1192*g  + 0.9505*b;

    x *= 100;
	y *= 100;
	z *= 100;
 
    return new cz.XYZTriple(x, y, z);
}

cz.XYZToRGB = function(x, y, z) {
    x /= 100;
    y /= 100; 
    z /= 100;

    function norm(x) {
        return (x > 0.0031308) ? 1.055*Math.pow(x, 1/2.4) - 0.055 : 12.92*x;
    }

    
    var r =  3.2406*x - 1.5372*y - 0.4986*z;
    var g = -0.9689*x + 1.8758*y + 0.0415*z;
    var b =  0.0557*x - 0.2040*y + 1.0570*z;

    r = norm(r);
    g = norm(g);
    b = norm(b);
 

    function bounds(x) {
        if (x < 0) return 0;
        if (x > 255) return 255;
        return x;
    }

    r = bounds(Math.round(r*255));
	g = bounds(Math.round(g*255));
	b = bounds(Math.round(b*255));
 
    return new cz.RGBTriple(r, g, b);
}

cz.XYZToLAB = function(x, y, z) {
    function func(t) {
        const thresh = 0.00885645; // (6/29)^3
        return (t > thresh) ? Math.pow(t, 0.3333333333) : 7.787037037037*t + 0.13793103448; // (1/3)*(29/6)^2*t + 4/29
    }

    // observer = 2A� 
    // illuminant = D50
    var xn = 96.422;
    var yn = 100;
    var zn = 82.521;

    var fx = func(x/xn);
    var fy = func(y/yn);
    var fz = func(z/zn);

    var l = 116*fy - 16;
    var a = 500*(fx - fy);
    var b = 200*(fy - fz);

    return new cz.LABTriple(l, a, b);
}

cz.LABToXYZ = function(l, a, b) {
    function func(t) {
        const thresh = 6/29;
        return (t > thresh) ? Math.pow(t, 3) : (t - 0.137931)*0.128418549;
    }

    var fy = (l + 16) / 116;
    var fx = fy + a/500;
    var fz = fy - b/200;

    var x = func(fx);
    var y = func(fy);
    var z = func(fz);

    // observer = 2A� 
    // illuminant = D50
    var xn = 96.422;
    var yn = 100;
    var zn = 82.521;

    x *= xn; 
    y *= yn; 
    z *= zn; 

    return new cz.XYZTriple(x, y, z);
}

cz.RGBToLAB = function(r, g, b) {
    var col = cz.RGBToXYZ(r, g, b);
    return cz.XYZToLAB(col.x, col.y, col.z);
}

cz.LABToRGB = function(l, a, b) {
    var col = cz.LABToXYZ(parseFloat(l), parseFloat(a), parseFloat(b));
    return cz.XYZToRGB(col.x, col.y, col.z);
}

cz.HSVToRGB = function(hue, sat, val) {
	var r, g, b;
	var i, f, p, q, t;

	if (sat == 0) {
		r = g = b = val;
	} else {
		hue = ((hue * 359) / (255*60));
		sat /= 255;
		val /= 255;

		i = Math.floor(hue);
		f = hue - i;
		p = val * (1 - sat);
		q = val * (1 - (sat * f));
		t = val * (1 - sat * (1 - f));

		switch (i) {
			case 0 : r = val; g = t;   b = p;   break;
			case 1 : r = q;   g = val; b = p;   break;
			case 2 : r = p;   g = val; b = t;   break;
			case 3 : r = p;   g = q;   b = val; break;
			case 4 : r = t;   g = p;   b = val; break;
			default: r = val; g = p;   b = q;
		}
		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);
	}
	return new cz.RGBTriple(r, g, b);
}

cz.RGBToCMYK = function(r, g, b) {
    var c = 255 - r;
    var m = 255 - g;
    var y = 255 - b;
    var k = Math.min(c, Math.min(m, y));

    if (k == 255) { 
        c = m = y = 0;
    } else {
        c = Math.round(255*((c - k) / (255 - k)));
        m = Math.round(255*((m - k) / (255 - k)));
        y = Math.round(255*((y - k) / (255 - k)));
    } 
    return new cz.CMYKQuadruple(c, m, y, k);
}

cz.CMYKToRGB = function(c, m, y, k) {
    c /= 255; m /= 255; y /= 255; k /= 255;

    c = c*(1-k) + k;
    m = m*(1-k) + k;
    y = y*(1-k) + k;

    r = Math.round((1-c)*255);
    g = Math.round((1-m)*255);
    b = Math.round((1-y)*255);

    return new cz.RGBTriple(r, g, b);
}


// this is actually a "value" component of HSV:
cz.GetColorLightness = function(color) {
	var r = cz.GetRValue(color);
	var g = cz.GetGValue(color);
	var b = cz.GetBValue(color);
	return Math.max(r, g, b);
}

// #ff0000 -> red
cz.HexaAttributeToPredefinedColor = function(hexCol) {
	hexCol = hexCol.toLowerCase();
  	if (hexCol == "#800000") { return "maroon"; }
  	if (hexCol == "#ff0000") { return "red"; }
  	if (hexCol == "#ffa500") { return "orange"; }
  	if (hexCol == "#ffff00") { return "yellow"; }
  	if (hexCol == "#808000") { return "olive"; }
  	if (hexCol == "#800080") { return "purple"; }
  	if (hexCol == "#ff00ff") { return "fuchsia"; }
  	if (hexCol == "#ffffff") { return "white"; }
  	if (hexCol == "#00ff00") { return "lime"; }
  	if (hexCol == "#008000") { return "green"; }
  	if (hexCol == "#000080") { return "navy"; }
  	if (hexCol == "#0000ff") { return "blue"; }
  	if (hexCol == "#00ffff") { return "aqua"; }
  	if (hexCol == "#008080") { return "teal"; }
  	if (hexCol == "#000000") { return "black"; }
  	if (hexCol == "#c0c0c0") { return "silver"; }
  	if (hexCol == "#808080") { return "gray"; }
	return null;
}

cz.FixHexValue = function(val) {
	if ((val.length != 7) || (val.substr(0, 1) != "#")) {
		return "#000000";
	}
	return val;
}

cz.FixByteValue = function(val) {
	if (val > 255) {
		val = 255;
	} else {
		if (val < 0) {
			val = 0;
		}
	}

	return val;
}

cz.Fix100Value = function(val) {
	if (val > 100) {
		val = 100;
	} else {
		if (val < 0) {
			val = 0;
		}
	}

	return val;
}

cz.FixLabABValue = function(val) {
  	if (val > 127) {
		val = 127;
	} else {
		if (val < -128) {
			val = -128;
		}
	}

	return val;
}

cz.ValidateByteValue = function(val) {
	if ((val < 0) || (val > 255)) {
		return false;
	}
	return true;
}

cz.CompareTwoStrings = function(a, b) {
	if ( a < b ) return -1;
        if ( a > b ) return 1;
        return 0;
}

cz.ClipString = function(text, length) {
    if (typeof length == 'undefined') {
        length = 15;
    }

    if (!text) return text;

    var clippedText; 
    if (text.length > length) {
        clippedText = text.substr(0,length) + "...";
    } else {
        clippedText = text;
    }
    return clippedText;
}

cz.GetColorPalettePermalink = function(colors, originUrl, name)  {
    // we are will try to keep the URL length under 2000 chars
    var colorsHex = [];
    
    for (var i=0; i < colors.length; i++) {
        var color = colors[i];
        var colorHex = cz.ColToRGBHexaAttribute(color).substring(1);
        colorsHex.push(colorHex);
    }

    if (colorsHex.length > 256) {
        // no more than 256 colors (URL length limitations)
        colorsHex = colorsHex.slice(0, 255);       
    }
 
    colors = colorsHex.join('+');

    var prefix = 'http://colorzilla.com/colors';
    var colorzillaPaletteURL = prefix + '/' + colorsHex.join('+');
    if (name) { 
        if (name.length > 64) {
            // clip the name if too long
            name = name.substr(0, 64);
        }
        colorzillaPaletteURL += '/' + encodeURIComponent(name);
    }

    var url = null;
    if (originUrl) {
        url = originUrl;
        url = url.replace(/^https?:\/\//, '');
        url = url.replace(/\?.*$/, '');
        url = url.replace(/#.*$/, '');
        url = encodeURIComponent(url);
    }

    if (url) {
          if ((colorzillaPaletteURL.length + url.length) < 1900) {
              colorzillaPaletteURL += '?source-url=' + url;
          }
    }

    return colorzillaPaletteURL;
}

cz.gbCZLowerCaseHexa = false;