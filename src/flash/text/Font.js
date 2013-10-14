/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/*
 * Copyright 2013 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global somewhatImplemented */

var FontDefinition = (function () {
  var fonts = [];
  var fontsByUniqueName = Object.create(null);
  var fontsByNameStyleType = Object.create(null);

  var _deviceFontMetrics;

  var def = {
    __class__: 'flash.text.Font',

    initialize: function () {
      var s = this.symbol;
      if (s) {
        this._fontName = s.name || null;
        this._uniqueName = s.uniqueName;
        if (s.bold) {
          if (s.italic) {
            this._fontStyle = 'boldItalic';
          } else {
            this._fontStyle = 'bold';
          }
        } else if (s.italic) {
          this._fontStyle = 'italic';
        } else {
          this._fontStyle = 'regular';
        }
        this._metrics = s.metrics;
        this._fontType = 'embedded';
        fonts.push(this);
        fontsByUniqueName[this._uniqueName] = this;
        var ident = this._fontName.toLowerCase() + '_' + this._fontStyle +
                    '_embedded';
        fontsByNameStyleType[ident] = this;
      }
    },

    get fontName() {
      return this._fontName;
    },
    get fontStyle() {
      return this._fontStyle;
    },
    get fontType() {
      return this._fontType;
    },
    hasGlyphs: function hasGlyphs(str) {
      return true; // TODO
    },

    getFont: function(name, style, embedded /* true|false */) {
      var ident = name.toLowerCase() + '_' + style +
                  (embedded ? '_embedded' : '_device');
      var font = fontsByNameStyleType[ident];
      if (font) {
        return font;
      }
      font = new flash.text.Font();
      font._fontName = font._uniqueName = name;
      font._fontStyle = style;
      font._fontType = 'device';
      var metrics = deviceFontMetrics()[name];
      if (!metrics) {
        metrics = deviceFontMetrics().serif;
        assert(metrics);
        font._fontName = font._uniqueName = 'serif';
      }
      font._metrics = {
        ascent: metrics[0],
        descent: metrics[1],
        leading: metrics[2]
      };
      fontsByNameStyleType[ident] = font;
      return font;
    },
    getFontByUniqueName: function(name) {
      return fontsByUniqueName[name];
    }
  };

  function enumerateFonts(device) {
    return fonts.slice();
  }

  function registerFont(font) {
    somewhatImplemented('Font.registerFont');
  }

  function deviceFontMetrics() {
    if (_deviceFontMetrics) {
      return _deviceFontMetrics;
    }
    var userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Windows") > -1) {
      _deviceFontMetrics = DEVICE_FONT_METRICS_WIN;
    } else if (/(Macintosh|iPad|iPhone|iPod|Android)/.test(userAgent)) {
      _deviceFontMetrics = DEVICE_FONT_METRICS_MAC;
    } else {
      _deviceFontMetrics = DEVICE_FONT_METRICS_LINUX;
    }
    return _deviceFontMetrics;
  }

  var desc = Object.getOwnPropertyDescriptor;

  def.__glue__ = {
    native: {
      instance: {
        fontName: desc(def, "fontName"),
        fontStyle: desc(def, "fontStyle"),
        fontType: desc(def, "fontType"),
        hasGlyphs: def.hasGlyphs
      },
      static: {
        enumerateFonts: enumerateFonts,
        registerFont: registerFont,
      }
    }
  };

  return def;
}).call(this);

var DEVICE_FONT_METRICS_WIN = {
  "serif": [1,0.25,0],
  "sans-serif": [1,0.25,0],
  "monospace": [1,0.25,0],
  "birch std": [0.9167,0.25,0],
  "blackoak std": [1,0.3333,0],
  "chaparral pro": [0.8333,0.3333,0],
  "chaparral pro light": [0.8333,0.3333,0],
  "charlemagne std": [0.9167,0.25,0],
  "cooper std black": [0.9167,0.25,0],
  "giddyup std": [0.8333,0.3333,0],
  "hobo std": [1.0833,0.3333,0],
  "kozuka gothic pro b": [1,0.4167,0],
  "kozuka gothic pro el": [1.0833,0.25,0],
  "kozuka gothic pro h": [1,0.4167,0],
  "kozuka gothic pro l": [1,0.3333,0],
  "kozuka gothic pro m": [1.0833,0.3333,0],
  "kozuka gothic pro r": [1,0.3333,0],
  "kozuka mincho pro b": [1.0833,0.25,0],
  "kozuka mincho pro el": [1.0833,0.25,0],
  "kozuka mincho pro h": [1.1667,0.25,0],
  "kozuka mincho pro l": [1.0833,0.25,0],
  "kozuka mincho pro m": [1.0833,0.25,0],
  "kozuka mincho pro r": [1.0833,0.25,0],
  "mesquite std": [0.9167,0.25,0],
  "minion pro cond": [1,0.3333,0],
  "minion pro med": [1,0.3333,0],
  "minion pro smbd": [1,0.3333,0],
  "myriad arabic": [1,0.4167,0],
  "nueva std": [0.75,0.25,0],
  "nueva std cond": [0.75,0.25,0],
  "ocr a std": [0.8333,0.25,0],
  "orator std": [1.0833,0.25,0],
  "poplar std": [0.9167,0.25,0],
  "prestige elite std": [0.9167,0.25,0],
  "rosewood std regular": [0.8333,0.3333,0],
  "stencil std": [1,0.3333,0],
  "trajan pro": [1,0.25,0],
  "kozuka gothic pr6n b": [1.4167,0.4167,0],
  "kozuka gothic pr6n el": [1.4167,0.3333,0],
  "kozuka gothic pr6n h": [1.4167,0.4167,0],
  "kozuka gothic pr6n l": [1.4167,0.3333,0],
  "kozuka gothic pr6n m": [1.5,0.3333,0],
  "kozuka gothic pr6n r": [1.4167,0.3333,0],
  "kozuka mincho pr6n b": [1.3333,0.3333,0],
  "kozuka mincho pr6n el": [1.3333,0.3333,0],
  "kozuka mincho pr6n h": [1.4167,0.3333,0],
  "kozuka mincho pr6n l": [1.3333,0.3333,0],
  "kozuka mincho pr6n m": [1.3333,0.3333,0],
  "kozuka mincho pr6n r": [1.3333,0.3333,0],
  "letter gothic std": [1,0.25,0],
  "minion pro": [1,0.3333,0],
  "myriad hebrew": [0.8333,0.3333,0],
  "myriad pro": [0.9167,0.25,0],
  "myriad pro cond": [0.9167,0.25,0],
  "myriad pro light": [1,0.25,0],
  "marlett": [1,0,0],
  "arial": [1,0.25,0],
  "arabic transparent": [1,0.25,0],
  "arial baltic": [1,0.25,0],
  "arial ce": [1,0.25,0],
  "arial cyr": [1,0.25,0],
  "arial greek": [1,0.25,0],
  "arial tur": [1,0.25,0],
  "batang": [0.8333,0.1667,0],
  "batangche": [0.8333,0.1667,0],
  "gungsuh": [0.8333,0.1667,0],
  "gungsuhche": [0.8333,0.1667,0],
  "courier new": [1,0.25,0],
  "courier new baltic": [1,0.25,0],
  "courier new ce": [1,0.25,0],
  "courier new cyr": [1,0.25,0],
  "courier new greek": [1,0.25,0],
  "courier new tur": [1,0.25,0],
  "daunpenh": [0.6667,0.6667,0],
  "dokchampa": [1.4167,0.5833,0],
  "estrangelo edessa": [0.75,0.3333,0],
  "euphemia": [1.0833,0.3333,0],
  "gautami": [1.1667,0.8333,0],
  "vani": [1.0833,0.75,0],
  "gulim": [0.8333,0.1667,0],
  "gulimche": [0.8333,0.1667,0],
  "dotum": [0.8333,0.1667,0],
  "dotumche": [0.8333,0.1667,0],
  "impact": [1.0833,0.25,0],
  "iskoola pota": [1,0.3333,0],
  "kalinga": [1.0833,0.5,0],
  "kartika": [1,0.4167,0],
  "khmer ui": [1.0833,0.3333,0],
  "lao ui": [1,0.25,0],
  "latha": [1.0833,0.4167,0],
  "lucida console": [0.75,0.25,0],
  "malgun gothic": [1,0.25,0],
  "mangal": [1.0833,0.3333,0],
  "meiryo": [1.0833,0.4167,0],
  "meiryo ui": [1,0.25,0],
  "microsoft himalaya": [0.5833,0.4167,0],
  "microsoft jhenghei": [1,0.3333,0],
  "microsoft yahei": [1.0833,0.3333,0],
  "mingliu": [0.8333,0.1667,0],
  "pmingliu": [0.8333,0.1667,0],
  "mingliu_hkscs": [0.8333,0.1667,0],
  "mingliu-extb": [0.8333,0.1667,0],
  "pmingliu-extb": [0.8333,0.1667,0],
  "mingliu_hkscs-extb": [0.8333,0.1667,0],
  "mongolian baiti": [0.8333,0.25,0],
  "ms gothic": [0.8333,0.1667,0],
  "ms pgothic": [0.8333,0.1667,0],
  "ms ui gothic": [0.8333,0.1667,0],
  "ms mincho": [0.8333,0.1667,0],
  "ms pmincho": [0.8333,0.1667,0],
  "mv boli": [1.1667,0.25,0],
  "microsoft new tai lue": [1,0.4167,0],
  "nyala": [0.9167,0.3333,0],
  "microsoft phagspa": [1.0833,0.25,0],
  "plantagenet cherokee": [1,0.4167,0],
  "raavi": [1.0833,0.6667,0],
  "segoe script": [1.0833,0.5,0],
  "segoe ui": [1,0.25,0],
  "segoe ui semibold": [1,0.25,0],
  "segoe ui light": [1,0.25,0],
  "segoe ui symbol": [1,0.25,0],
  "shruti": [1.0833,0.5,0],
  "simsun": [0.8333,0.1667,0],
  "nsimsun": [0.8333,0.1667,0],
  "simsun-extb": [0.8333,0.1667,0],
  "sylfaen": [1,0.3333,0],
  "microsoft tai le": [1,0.3333,0],
  "times new roman": [1,0.25,0],
  "times new roman baltic": [1,0.25,0],
  "times new roman ce": [1,0.25,0],
  "times new roman cyr": [1,0.25,0],
  "times new roman greek": [1,0.25,0],
  "times new roman tur": [1,0.25,0],
  "tunga": [1.0833,0.75,0],
  "vrinda": [1,0.4167,0],
  "shonar bangla": [0.8333,0.5,0],
  "microsoft yi baiti": [0.8333,0.1667,0],
  "tahoma": [1,0.1667,0],
  "microsoft sans serif": [1.0833,0.1667,0],
  "angsana new": [0.9167,0.4167,0],
  "aparajita": [0.75,0.4167,0],
  "cordia new": [0.9167,0.5,0],
  "ebrima": [1.0833,0.5,0],
  "gisha": [0.9167,0.25,0],
  "kokila": [0.8333,0.3333,0],
  "leelawadee": [0.9167,0.25,0],
  "microsoft uighur": [1.0833,0.5,0],
  "moolboran": [0.6667,0.6667,0],
  "symbol": [1,0.25,0],
  "utsaah": [0.8333,0.4167,0],
  "vijaya": [1.0833,0.25,0],
  "wingdings": [0.9167,0.25,0],
  "andalus": [1.3333,0.4167,0],
  "arabic typesetting": [0.8333,0.5,0],
  "simplified arabic": [1.3333,0.5,0],
  "simplified arabic fixed": [1,0.4167,0],
  "sakkal majalla": [0.9167,0.5,0],
  "traditional arabic": [1.3333,0.5,0],
  "aharoni": [0.75,0.25,0],
  "david": [0.75,0.25,0],
  "frankruehl": [0.75,0.25,0],
  "fangsong": [0.8333,0.1667,0],
  "simhei": [0.8333,0.1667,0],
  "kaiti": [0.8333,0.1667,0],
  "browallia new": [0.8333,0.4167,0],
  "lucida sans unicode": [1.0833,0.25,0],
  "arial black": [1.0833,0.3333,0],
  "calibri": [0.9167,0.25,0],
  "cambria": [0.9167,0.25,0],
  "cambria math": [3.0833,2.5,0],
  "candara": [0.9167,0.25,0],
  "comic sans ms": [1.0833,0.3333,0],
  "consolas": [0.9167,0.25,0],
  "constantia": [0.9167,0.25,0],
  "corbel": [0.9167,0.25,0],
  "franklin gothic medium": [1,0.3333,0],
  "gabriola": [1.1667,0.6667,0],
  "georgia": [1,0.25,0],
  "palatino linotype": [1.0833,0.3333,0],
  "segoe print": [1.25,0.5,0],
  "trebuchet ms": [1.0833,0.4167,0],
  "verdana": [1,0.1667,0],
  "webdings": [1.0833,0.5,0],
  "lucida bright": [0.9167,0.25,0],
  "lucida sans": [0.9167,0.25,0],
  "lucida sans typewriter": [0.9167,0.25,0],
  "gentium basic": [0.8333,0.25,0],
  "dejavu serif condensed": [0.9167,0.25,0],
  "arimo": [1,0.25,0],
  "dejavu sans condensed": [0.9167,0.25,0],
  "dejavu sans": [0.9167,0.25,0],
  "dejavu sans light": [0.9167,0.25,0],
  "opensymbol": [0.8333,0.1667,0],
  "gentium book basic": [0.8333,0.25,0],
  "dejavu sans mono": [0.9167,0.25,0],
  "dejavu serif": [0.9167,0.25,0],
  "calibri light": [0.9167,0.25,0],
};

var DEVICE_FONT_METRICS_MAC = {
  "al bayan plain": [1,0.5,0],
  "al bayan bold": [1,0.5833,0],
  "american typewriter": [0.9167,0.25,0],
  "american typewriter bold": [0.9167,0.25,0],
  "american typewriter condensed": [0.9167,0.25,0],
  "american typewriter condensed bold": [0.9167,0.25,0],
  "american typewriter condensed light": [0.8333,0.25,0],
  "american typewriter light": [0.9167,0.25,0],
  "andale mono": [0.9167,0.25,0],
  "apple symbols": [0.6667,0.25,0],
  "arial bold italic": [0.9167,0.25,0],
  "arial bold": [0.9167,0.25,0],
  "arial italic": [0.9167,0.25,0],
  "arial hebrew": [0.75,0.3333,0],
  "arial hebrew bold": [0.75,0.3333,0],
  "arial": [0.9167,0.25,0],
  "arial narrow": [0.9167,0.25,0],
  "arial narrow bold": [0.9167,0.25,0],
  "arial narrow bold italic": [0.9167,0.25,0],
  "arial narrow italic": [0.9167,0.25,0],
  "arial rounded mt bold": [0.9167,0.25,0],
  "arial unicode ms": [1.0833,0.25,0],
  "avenir black": [1,0.3333,0],
  "avenir black oblique": [1,0.3333,0],
  "avenir book": [1,0.3333,0],
  "avenir book oblique": [1,0.3333,0],
  "avenir heavy": [1,0.3333,0],
  "avenir heavy oblique": [1,0.3333,0],
  "avenir light": [1,0.3333,0],
  "avenir light oblique": [1,0.3333,0],
  "avenir medium": [1,0.3333,0],
  "avenir medium oblique": [1,0.3333,0],
  "avenir oblique": [1,0.3333,0],
  "avenir roman": [1,0.3333,0],
  "avenir next bold": [1,0.3333,0],
  "avenir next bold italic": [1,0.3333,0],
  "avenir next demi bold": [1,0.3333,0],
  "avenir next demi bold italic": [1,0.3333,0],
  "avenir next heavy": [1,0.3333,0],
  "avenir next heavy italic": [1,0.3333,0],
  "avenir next italic": [1,0.3333,0],
  "avenir next medium": [1,0.3333,0],
  "avenir next medium italic": [1,0.3333,0],
  "avenir next regular": [1,0.3333,0],
  "avenir next ultra light": [1,0.3333,0],
  "avenir next ultra light italic": [1,0.3333,0],
  "avenir next condensed bold": [1,0.3333,0],
  "avenir next condensed bold italic": [1,0.3333,0],
  "avenir next condensed demi bold": [1,0.3333,0],
  "avenir next condensed demi bold italic": [1,0.3333,0],
  "avenir next condensed heavy": [1,0.3333,0],
  "avenir next condensed heavy italic": [1,0.3333,0],
  "avenir next condensed italic": [1,0.3333,0],
  "avenir next condensed medium": [1,0.3333,0],
  "avenir next condensed medium italic": [1,0.3333,0],
  "avenir next condensed regular": [1,0.3333,0],
  "avenir next condensed ultra light": [1,0.3333,0],
  "avenir next condensed ultra light italic": [1,0.3333,0],
  "ayuthaya": [1.0833,0.3333,0],
  "baghdad": [0.9167,0.4167,0],
  "bangla mn": [0.9167,0.6667,0],
  "bangla mn bold": [0.9167,0.6667,0],
  "bangla sangam mn": [0.9167,0.4167,0],
  "bangla sangam mn bold": [0.9167,0.4167,0],
  "baskerville": [0.9167,0.25,0],
  "baskerville bold": [0.9167,0.25,0],
  "baskerville bold italic": [0.9167,0.25,0],
  "baskerville italic": [0.9167,0.25,0],
  "baskerville semibold": [0.9167,0.25,0],
  "baskerville semibold italic": [0.9167,0.25,0],
  "big caslon medium": [0.9167,0.25,0],
  "brush script mt italic": [0.9167,0.3333,0],
  "chalkboard": [1,0.25,0],
  "chalkboard bold": [1,0.25,0],
  "chalkboard se bold": [1.1667,0.25,0],
  "chalkboard se light": [1.1667,0.25,0],
  "chalkboard se regular": [1.1667,0.25,0],
  "chalkduster": [1,0.25,0],
  "charcoal cy": [1,0.25,0],
  "cochin": [0.9167,0.25,0],
  "cochin bold": [0.9167,0.25,0],
  "cochin bold italic": [0.9167,0.25,0],
  "cochin italic": [0.9167,0.25,0],
  "comic sans ms": [1.0833,0.25,0],
  "comic sans ms bold": [1.0833,0.25,0],
  "copperplate": [0.75,0.25,0],
  "copperplate bold": [0.75,0.25,0],
  "copperplate light": [0.75,0.25,0],
  "corsiva hebrew": [0.6667,0.3333,0],
  "corsiva hebrew bold": [0.6667,0.3333,0],
  "courier": [0.75,0.25,0],
  "courier bold": [0.75,0.25,0],
  "courier bold oblique": [0.75,0.25,0],
  "courier oblique": [0.75,0.25,0],
  "courier new bold italic": [0.8333,0.3333,0],
  "courier new bold": [0.8333,0.3333,0],
  "courier new italic": [0.8333,0.3333,0],
  "courier new": [0.8333,0.3333,0],
  "biaukai": [0.8333,0.1667,0],
  "damascus": [0.5833,0.4167,0],
  "damascus bold": [0.5833,0.4167,0],
  "decotype naskh": [1.1667,0.6667,0],
  "devanagari mt": [0.9167,0.6667,0],
  "devanagari mt bold": [0.9167,0.6667,0],
  "devanagari sangam mn": [0.9167,0.4167,0],
  "devanagari sangam mn bold": [0.9167,0.4167,0],
  "didot": [0.9167,0.3333,0],
  "didot bold": [1,0.3333,0],
  "didot italic": [0.9167,0.25,0],
  "euphemia ucas": [1.0833,0.25,0],
  "euphemia ucas bold": [1.0833,0.25,0],
  "euphemia ucas italic": [1.0833,0.25,0],
  "futura condensed extrabold": [1,0.25,0],
  "futura condensed medium": [1,0.25,0],
  "futura medium": [1,0.25,0],
  "futura medium italic": [1,0.25,0],
  "gb18030 bitmap": [1,0.6667,0],
  "geeza pro": [0.9167,0.3333,0],
  "geeza pro bold": [0.9167,0.3333,0],
  "geneva": [1,0.25,0],
  "geneva cy": [1,0.25,0],
  "georgia": [0.9167,0.25,0],
  "georgia bold": [0.9167,0.25,0],
  "georgia bold italic": [0.9167,0.25,0],
  "georgia italic": [0.9167,0.25,0],
  "gill sans": [0.9167,0.25,0],
  "gill sans bold": [0.9167,0.25,0],
  "gill sans bold italic": [0.9167,0.25,0],
  "gill sans italic": [0.9167,0.25,0],
  "gill sans light": [0.9167,0.25,0],
  "gill sans light italic": [0.9167,0.25,0],
  "gujarati mt": [0.9167,0.6667,0],
  "gujarati mt bold": [0.9167,0.6667,0],
  "gujarati sangam mn": [0.8333,0.4167,0],
  "gujarati sangam mn bold": [0.8333,0.4167,0],
  "gurmukhi mn": [0.9167,0.25,0],
  "gurmukhi mn bold": [0.9167,0.25,0],
  "gurmukhi sangam mn": [0.9167,0.3333,0],
  "gurmukhi sangam mn bold": [0.9167,0.3333,0],
  "helvetica": [0.75,0.25,0],
  "helvetica bold": [0.75,0.25,0],
  "helvetica bold oblique": [0.75,0.25,0],
  "helvetica light": [0.75,0.25,0],
  "helvetica light oblique": [0.75,0.25,0],
  "helvetica oblique": [0.75,0.25,0],
  "helvetica neue": [0.9167,0.25,0],
  "helvetica neue bold": [1,0.25,0],
  "helvetica neue bold italic": [1,0.25,0],
  "helvetica neue condensed black": [1,0.25,0],
  "helvetica neue condensed bold": [1,0.25,0],
  "helvetica neue italic": [0.9167,0.25,0],
  "helvetica neue light": [1,0.25,0],
  "helvetica neue light italic": [0.9167,0.25,0],
  "helvetica neue medium": [1,0.25,0],
  "helvetica neue ultralight": [0.9167,0.25,0],
  "helvetica neue ultralight italic": [0.9167,0.25,0],
  "herculanum": [0.8333,0.1667,0],
  "hiragino kaku gothic pro w3": [0.9167,0.0833,0],
  "hiragino kaku gothic pro w6": [0.9167,0.0833,0],
  "hiragino kaku gothic pron w3": [0.9167,0.0833,0],
  "hiragino kaku gothic pron w6": [0.9167,0.0833,0],
  "hiragino kaku gothic std w8": [0.9167,0.0833,0],
  "hiragino kaku gothic stdn w8": [0.9167,0.0833,0],
  "hiragino maru gothic pro w4": [0.9167,0.0833,0],
  "hiragino maru gothic pron w4": [0.9167,0.0833,0],
  "hiragino mincho pro w3": [0.9167,0.0833,0],
  "hiragino mincho pro w6": [0.9167,0.0833,0],
  "hiragino mincho pron w3": [0.9167,0.0833,0],
  "hiragino mincho pron w6": [0.9167,0.0833,0],
  "hiragino sans gb w3": [0.9167,0.0833,0],
  "hiragino sans gb w6": [0.9167,0.0833,0],
  "hoefler text black": [0.75,0.25,0],
  "hoefler text black italic": [0.75,0.25,0],
  "hoefler text italic": [0.75,0.25,0],
  "hoefler text ornaments": [0.8333,0.1667,0],
  "hoefler text": [0.75,0.25,0],
  "impact": [1,0.25,0],
  "inaimathi": [0.8333,0.4167,0],
  "headlinea regular": [0.8333,0.1667,0],
  "pilgi regular": [0.8333,0.25,0],
  "gungseo regular": [0.8333,0.25,0],
  "pcmyungjo regular": [0.8333,0.25,0],
  "kailasa regular": [1.0833,0.5833,0],
  "kannada mn": [0.9167,0.25,0],
  "kannada mn bold": [0.9167,0.25,0],
  "kannada sangam mn": [1,0.5833,0],
  "kannada sangam mn bold": [1,0.5833,0],
  "kefa bold": [0.9167,0.25,0],
  "kefa regular": [0.9167,0.25,0],
  "khmer mn": [1,0.6667,0],
  "khmer mn bold": [1,0.6667,0],
  "khmer sangam mn": [1.0833,0.6667,0],
  "kokonor regular": [1.0833,0.5833,0],
  "krungthep": [1,0.25,0],
  "kufistandardgk": [0.9167,0.5,0],
  "lao mn": [0.9167,0.4167,0],
  "lao mn bold": [0.9167,0.4167,0],
  "lao sangam mn": [1,0.3333,0],
  "apple ligothic medium": [0.8333,0.1667,0],
  "lihei pro": [0.8333,0.1667,0],
  "lisong pro": [0.8333,0.1667,0],
  "lucida grande": [1,0.25,0],
  "lucida grande bold": [1,0.25,0],
  "malayalam mn": [1,0.4167,0],
  "malayalam mn bold": [1,0.4167,0],
  "malayalam sangam mn": [0.8333,0.4167,0],
  "malayalam sangam mn bold": [0.8333,0.4167,0],
  "marion bold": [0.6667,0.3333,0],
  "marion italic": [0.6667,0.3333,0],
  "marion regular": [0.6667,0.3333,0],
  "marker felt thin": [0.8333,0.25,0],
  "marker felt wide": [0.9167,0.25,0],
  "menlo bold": [0.9167,0.25,0],
  "menlo bold italic": [0.9167,0.25,0],
  "menlo italic": [0.9167,0.25,0],
  "menlo regular": [0.9167,0.25,0],
  "microsoft sans serif": [0.9167,0.25,0],
  "monaco": [1,0.25,0],
  "gurmukhi mt": [0.8333,0.4167,0],
  "mshtakan": [0.9167,0.25,0],
  "mshtakan bold": [0.9167,0.25,0],
  "mshtakan boldoblique": [0.9167,0.25,0],
  "mshtakan oblique": [0.9167,0.25,0],
  "myanmar mn": [1,0.4167,0],
  "myanmar mn bold": [1,0.4167,0],
  "myanmar sangam mn": [0.9167,0.4167,0],
  "nadeem": [0.9167,0.4167,0],
  "nanum brush script": [0.9167,0.25,0],
  "nanumgothic": [0.9167,0.25,0],
  "nanumgothic bold": [0.9167,0.25,0],
  "nanumgothic extrabold": [0.9167,0.25,0],
  "nanummyeongjo": [0.9167,0.25,0],
  "nanummyeongjo bold": [0.9167,0.25,0],
  "nanummyeongjo extrabold": [0.9167,0.25,0],
  "nanum pen script": [0.9167,0.25,0],
  "optima bold": [0.9167,0.25,0],
  "optima bold italic": [0.9167,0.25,0],
  "optima extrablack": [1,0.25,0],
  "optima italic": [0.9167,0.25,0],
  "optima regular": [0.9167,0.25,0],
  "oriya mn": [0.9167,0.25,0],
  "oriya mn bold": [0.9167,0.25,0],
  "oriya sangam mn": [0.8333,0.4167,0],
  "oriya sangam mn bold": [0.8333,0.4167,0],
  "osaka": [1,0.25,0],
  "osaka-mono": [0.8333,0.1667,0],
  "palatino bold": [0.8333,0.25,0],
  "palatino bold italic": [0.8333,0.25,0],
  "palatino italic": [0.8333,0.25,0],
  "palatino": [0.8333,0.25,0],
  "papyrus": [0.9167,0.5833,0],
  "papyrus condensed": [0.9167,0.5833,0],
  "plantagenet cherokee": [0.6667,0.25,0],
  "raanana": [0.75,0.25,0],
  "raanana bold": [0.75,0.25,0],
  "hei regular": [0.8333,0.1667,0],
  "kai regular": [0.8333,0.1667,0],
  "stfangsong": [0.8333,0.1667,0],
  "stheiti": [0.8333,0.1667,0],
  "heiti sc light": [0.8333,0.1667,0],
  "heiti sc medium": [0.8333,0.1667,0],
  "heiti tc light": [0.8333,0.1667,0],
  "heiti tc medium": [0.8333,0.1667,0],
  "stkaiti": [0.8333,0.1667,0],
  "kaiti sc black": [1.0833,0.3333,0],
  "kaiti sc bold": [1.0833,0.3333,0],
  "kaiti sc regular": [1.0833,0.3333,0],
  "stsong": [0.8333,0.1667,0],
  "songti sc black": [1.0833,0.3333,0],
  "songti sc bold": [1.0833,0.3333,0],
  "songti sc light": [1.0833,0.3333,0],
  "songti sc regular": [1.0833,0.3333,0],
  "stxihei": [0.8333,0.1667,0],
  "sathu": [0.9167,0.3333,0],
  "silom": [1,0.3333,0],
  "sinhala mn": [0.9167,0.25,0],
  "sinhala mn bold": [0.9167,0.25,0],
  "sinhala sangam mn": [1.1667,0.3333,0],
  "sinhala sangam mn bold": [1.1667,0.3333,0],
  "skia regular": [0.75,0.25,0],
  "symbol": [0.6667,0.3333,0],
  "tahoma negreta": [1,0.1667,0],
  "tamil mn": [0.9167,0.25,0],
  "tamil mn bold": [0.9167,0.25,0],
  "tamil sangam mn": [0.75,0.25,0],
  "tamil sangam mn bold": [0.75,0.25,0],
  "telugu mn": [0.9167,0.25,0],
  "telugu mn bold": [0.9167,0.25,0],
  "telugu sangam mn": [1,0.5833,0],
  "telugu sangam mn bold": [1,0.5833,0],
  "thonburi": [1.0833,0.25,0],
  "thonburi bold": [1.0833,0.25,0],
  "times bold": [0.75,0.25,0],
  "times bold italic": [0.75,0.25,0],
  "times italic": [0.75,0.25,0],
  "times roman": [0.75,0.25,0],
  "times new roman bold italic": [0.9167,0.25,0],
  "times new roman bold": [0.9167,0.25,0],
  "times new roman italic": [0.9167,0.25,0],
  "times new roman": [0.9167,0.25,0],
  "trebuchet ms bold italic": [0.9167,0.25,0],
  "trebuchet ms": [0.9167,0.25,0],
  "trebuchet ms bold": [0.9167,0.25,0],
  "trebuchet ms italic": [0.9167,0.25,0],
  "verdana": [1,0.25,0],
  "verdana bold": [1,0.25,0],
  "verdana bold italic": [1,0.25,0],
  "verdana italic": [1,0.25,0],
  "webdings": [0.8333,0.1667,0],
  "wingdings 2": [0.8333,0.25,0],
  "wingdings 3": [0.9167,0.25,0],
  "yuppy sc regular": [1.0833,0.3333,0],
  "yuppy tc regular": [1.0833,0.3333,0],
  "zapf dingbats": [0.8333,0.1667,0],
  "zapfino": [1.9167,1.5,0]
};

var DEVICE_FONT_METRICS_LINUX = {
  "kacstfarsi": [1.0831,0.5215,0],
  "meera": [0.682,0.4413,0],
  "freemono": [0.8023,0.2006,0],
  "undotum": [1.0029,0.2808,0],
  "loma": [1.1634,0.4814,0],
  "century schoolbook l": [1.0029,0.3209,0],
  "kacsttitlel": [1.0831,0.5215,0],
  "undinaru": [1.0029,0.2407,0],
  "ungungseo": [1.0029,0.2808,0],
  "garuda": [1.3238,0.6017,0],
  "rekha": [1.1232,0.2808,0],
  "purisa": [1.1232,0.5215,0],
  "dejavu sans mono": [0.9628,0.2407,0],
  "vemana2000": [0.8825,0.8424,0],
  "kacstoffice": [1.0831,0.5215,0],
  "umpush": [1.2837,0.682,0],
  "opensymbol": [0.8023,0.2006,0],
  "sawasdee": [1.1232,0.4413,0],
  "urw palladio l": [1.0029,0.3209,0],
  "freeserif": [0.9227,0.3209,0],
  "kacstdigital": [1.0831,0.5215,0],
  "ubuntu condensed": [0.9628,0.2006,0],
  "unpilgi": [1.0029,0.4413,0],
  "mry_kacstqurn": [1.4442,0.7221,0],
  "urw gothic l": [1.0029,0.2407,0],
  "dingbats": [0.8424,0.1605,0],
  "urw chancery l": [1.0029,0.3209,0],
  "phetsarath ot": [1.0831,0.5215,0],
  "tlwg typist": [0.8825,0.4012,0],
  "kacstletter": [1.0831,0.5215,0],
  "utkal": [1.2035,0.6418,0],
  "dejavu sans light": [0.9628,0.2407,0],
  "norasi": [1.2436,0.5215,0],
  "dejavu serif condensed": [0.9628,0.2407,0],
  "kacstone": [1.2436,0.6418,0],
  "liberation sans narrow": [0.9628,0.2407,0],
  "symbol": [1.043,0.3209,0],
  "nanummyeongjo": [0.9227,0.2407,0],
  "untitled1": [0.682,0.5616,0],
  "lohit gujarati": [0.9628,0.4012,0],
  "liberation mono": [0.8424,0.3209,0],
  "kacstart": [1.0831,0.5215,0],
  "mallige": [1.0029,0.682,0],
  "bitstream charter": [1.0029,0.2407,0],
  "nanumgothic": [0.9227,0.2407,0],
  "liberation serif": [0.9227,0.2407,0],
  "dejavu sans condensed": [0.9628,0.2407,0],
  "ubuntu": [0.9628,0.2006,0],
  "courier 10 pitch": [0.8825,0.3209,0],
  "nimbus sans l": [0.9628,0.3209,0],
  "takaopgothic": [0.8825,0.2006,0],
  "wenquanyi micro hei mono": [0.9628,0.2407,0],
  "dejavu sans": [0.9628,0.2407,0],
  "kedage": [1.0029,0.682,0],
  "kinnari": [1.3238,0.5215,0],
  "tlwgmono": [0.8825,0.4012,0],
  "standard symbols l": [1.043,0.3209,0],
  "lohit punjabi": [1.2035,0.682,0],
  "nimbus mono l": [0.8424,0.2808,0],
  "rachana": [0.682,0.5616,0],
  "waree": [1.2436,0.4413,0],
  "kacstposter": [1.0831,0.5215,0],
  "khmer os": [1.2837,0.7622,0],
  "freesans": [1.0029,0.3209,0],
  "gargi": [0.9628,0.2808,0],
  "nimbus roman no9 l": [0.9628,0.3209,0],
  "dejavu serif": [0.9628,0.2407,0],
  "wenquanyi micro hei": [0.9628,0.2407,0],
  "ubuntu light": [0.9628,0.2006,0],
  "tlwgtypewriter": [0.9227,0.4012,0],
  "kacstpen": [1.0831,0.5215,0],
  "tlwg typo": [0.8825,0.4012,0],
  "mukti narrow": [1.2837,0.4413,0],
  "ubuntu mono": [0.8424,0.2006,0],
  "lohit bengali": [1.0029,0.4413,0],
  "liberation sans": [0.9227,0.2407,0],
  "unbatang": [1.0029,0.2808,0],
  "kacstdecorative": [1.1232,0.5215,0],
  "khmer os system": [1.2436,0.6017,0],
  "saab": [1.0029,0.682,0],
  "kacsttitle": [1.0831,0.5215,0],
  "mukti narrow bold": [1.2837,0.4413,0],
  "lohit hindi": [1.0029,0.5215,0],
  "kacstqurn": [1.0831,0.5215,0],
  "urw bookman l": [0.9628,0.2808,0],
  "kacstnaskh": [1.0831,0.5215,0],
  "kacstscreen": [1.0831,0.5215,0],
  "pothana2000": [0.8825,0.8424,0],
  "ungraphic": [1.0029,0.2808,0],
  "lohit tamil": [0.8825,0.361,0],
  "kacstbook": [1.0831,0.5215,0]
};

/*jshint proto:true */
DEVICE_FONT_METRICS_MAC.__proto__ = DEVICE_FONT_METRICS_WIN;
DEVICE_FONT_METRICS_LINUX.__proto__ = DEVICE_FONT_METRICS_MAC;
