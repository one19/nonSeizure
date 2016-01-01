/**

  ____ _     ___  ____    _    _      __     ___    ____  ____  
 / ___| |   / _ \| __ )  / \  | |     \ \   / / \  |  _ \/ ___| 
| |  _| |  | | | |  _ \ / _ \ | |      \ \ / / _ \ | |_) \___ \ 
| |_| | |__| |_| | |_) / ___ \| |___    \ V / ___ \|  _ < ___) |
 \____|_____\___/|____/_/   \_\_____|    \_/_/   \_\_| \_\____/ 
                                                                

**/

var MINCIRCLES = 15;
var MAXCIRCLES = 25;
var CIRCLENUM = 0;
var MINSIZE = 50;
var MAXCIRCLESIZE = 150;
var MINSTREAK = 30; //in fps
var MAXSTREAK = 120;

var pageson = {
  widthPriority: {
    top: ['a0', 'a1', 'a2'],
    mid: ['a4', 'a5', 'a3'],
    bot: ['a8', 'a7', 'a6']
  },
  heightPriority: {
    lef: ['a0', 'a3', 'a6'],
    mid: ['a4', 'a1', 'a7'],
    rig: ['a8', 'a5', 'a2']
  },
  squares: [],
  circles: [],
  ms: 13,
  delta: 2,
  usePics: false,
  pageHeight: window.innerHeight - 70,
  pageWidth: window.innerWidth
}


/**

 _____ _   _ _   _  ____ _____ ___ ___  _   _ ____  
|  ___| | | | \ | |/ ___|_   _|_ _/ _ \| \ | / ___| 
| |_  | | | |  \| | |     | |  | | | | |  \| \___ \ 
|  _| | |_| | |\  | |___  | |  | | |_| | |\  |___) |
|_|    \___/|_| \_|\____| |_| |___\___/|_| \_|____/ 
                                                    

**/

//produces either +1 or -1 with 50% chance for both
var plusOrMinus = function() {
  return [-1,1][Math.random()*2|0];
}

//produces round number between min and max with even distribution
var minToMax = function(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

CIRCLENUM = minToMax(MINCIRCLES, MAXCIRCLES);

//returns an array of integers because apparently jquery is retarded, and can
//only give back things in `rgb` and `px`
var getVal = function(selector, cssWithin, pjson) {
  var ret = $(selector).css(cssWithin);

  if ((cssWithin === 'background-color') || (cssWithin === 'color')) {
    var toteString = ret.slice(4, -1).split(', ');
    return [parseInt(toteString[0]), parseInt(toteString[1]), parseInt(toteString[2])];
  } else if (cssWithin === 'z-index') {
    return [parseInt(ret)];
  } else {
    return [parseInt(ret.slice(0, -2))];
  }
}

pageson.background = {
  red: {
    val: 218,
    streak: minToMax(MINSTREAK, MAXSTREAK),
    del: plusOrMinus()
  },
  green: {
    val: 165,
    streak: minToMax(MINSTREAK, MAXSTREAK),
    del: plusOrMinus()
  },
  blue: {
    val: 32,
    streak: minToMax(MINSTREAK, MAXSTREAK),
    del: plusOrMinus()
  }
}


//creates the circles that will move randomly about the page
//returns an object with their relevant data
var jsonCircles = function(circleCount, pjson) {

  var startNum = $('.circle').length;
  if (circleCount < 0) pjson.circles.splice( circleCount, circleCount * -1);
  if (circleCount === 0) pjson.circles = [];

  for (var i = 0; i < circleCount; i++) {
    var selector = 'b' + (i + startNum);

    var size = minToMax(MINSIZE, MAXCIRCLESIZE);
    var offset = Math.round(size/2);
    var top = minToMax( 0 - offset, pjson.pageHeight - offset + 70);
    var left = minToMax( 0 - offset, pjson.pageWidth - offset );
    var bNums = makeRandomColor();
    var cNums = makeRandomColor();

    pjson.circles.push({
      selector: selector,
      borderWidth: {
        val: size * 0.2,
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      bRed: {
        val: bNums[0],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      bGreen: {
        val: bNums[1],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      bBlue: {
        val: bNums[2],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      size: {
        val: size,
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      red: {
        val: cNums[0],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      green: {
        val: cNums[1],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      blue: {
        val: cNums[2],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      background: {
        pic: ['katy.png', 'lil.png', 'dru.png', 'sher.png', 'con.png', 'dav.png', 'mom.png', 'dum.png', 'ash.png', 'dad.png'][minToMax(0, 9)]
      },
      top: {
        val: top,
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: minToMax(-1, 1)
      },
      left: {
        val: left,
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: minToMax(-1, 1)
      }
    });
  }
}

var jsonSquares = function(pjson) {
  var margin = Math.floor(pjson.pageWidth * 0.04);
  var damargin = (margin * 5);
  var cNums = makeRandomColor();

  var maxPrimeWidth = Math.floor(pjson.pageWidth * 0.4);
  var minPrimeWidth = Math.floor(pjson.pageWidth * 0.3);
  var maxWidth = Math.floor(pjson.pageWidth * 0.25);
  var minWidth = Math.floor(pjson.pageWidth * 0.2);

  var maxPrimeHeight = Math.floor( (pjson.pageHeight - 100 - damargin) * 0.4);
  var minPrimeHeight = Math.floor( (pjson.pageHeight - 100 - damargin) * 0.3);
  var maxHeight = Math.floor((pjson.pageHeight - 100 - damargin) * 0.25);
  var minHeight = Math.floor((pjson.pageHeight - 100 - damargin) * 0.2);

  for (var i = 0; i < 9; i++) {
    var bNums = makeRandomColor();
    var cNums = makeRandomColor();
    pjson.squares.push({
      selector: 'a' + i,
      borderWidth: {
        val: margin * 0.1,
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      bRed: {
        val: bNums[0],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      bGreen: {
        val: bNums[1],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      bBlue: {
        val: bNums[2],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      red: {
        val: cNums[0],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      green: {
        val: cNums[1],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      blue: {
        val: cNums[2],
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      top: {
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: minToMax(-1, 1)
      },
      height: {
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      },
      left: {
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: minToMax(-1, 1)
      },
      width: {
        streak: minToMax(MINSTREAK, MAXSTREAK),
        del: plusOrMinus()
      }
    });
  }

  Object.keys(pjson.widthPriority).forEach(function(e, i) {
    var primeWidth = 0;
    var midWidth = 0;
    
    pjson.widthPriority[e].forEach(function(r, j) {
      var index = parseInt(r.slice(1));
      if (j === 0) {
        var width = minToMax(minPrimeWidth, maxPrimeWidth);
        primeWidth = width;
      } else if (j === 1) {
        var width = minToMax(minWidth, maxWidth);
        midWidth = width;
      } else {
        var width = pjson.pageWidth - damargin - primeWidth - midWidth;
      }
      pjson.squares[index].width.val = width;
    });

    for (var k = 0; k < 3; k++) {
      var ind = k + (i * 3);
      if (k === 0) {
        pjson.squares[ind].left.val = 0;
      } else if (k === 1) {
        pjson.squares[ind].left.val = (margin * 1.75) +
          pjson.squares[ind - 1].width.val;
      } else {
        pjson.squares[ind].left.val = (margin * 3.5) +
          pjson.squares[ind - 1].width.val +
          pjson.squares[ind - 2].width.val;
      }
    }
  });

  Object.keys(pjson.heightPriority).forEach(function(e, i) {
    var primeHeight = 0;
    var midHeight = 0;
    
    pjson.heightPriority[e].forEach(function(r, j) {
      var index = parseInt(r.slice(1));
      if (j === 0) {
        var height = minToMax(minPrimeHeight, maxPrimeHeight);
        primeHeight = height;
      } else if (j === 2) {
        var height = minToMax(minHeight, maxHeight);
        midHeight = height;
      } else {
        var height = pjson.pageHeight - damargin - primeHeight - midHeight;
      }
      pjson.squares[index].height.val = height;
    });

    for (var i = 0; i < 3; i++) {
      for (var k = 0; k < 3; k++) {
        var ind = (i * 3) + k;
        if (i === 0) {
          pjson.squares[ind].top.val = 0;
        } else if (i === 1) {
          pjson.squares[ind].top.val = (margin * 1.75) +
            pjson.squares[ind - 3].height.val;
        } else {
          pjson.squares[ind].top.val = (margin * 3.5) +
            pjson.squares[ind - 3].height.val +
            pjson.squares[ind - 6].height.val;
        }
      }
    }
  });
}

var makeRandomColor = function() {
  return [minToMax(0,255), minToMax(0,255), minToMax(0,255)];
}

var makeSelectiveColor = function() {
  //TODO
}

var update = function(pjson) {
  pjson.pageHeight = window.innerHeight;
  pjson.pageWidth = window.innerWidth;

  //var pjson = JSON.stringify(JSON.parse(lastState));
  pjson.circles.forEach(function(circle, ind) {
    Object.keys(circle).forEach(function(e) {
      pjson.circles[ind] = updateProperty(e, circle, pjson);
    });
  });
  pjson.squares.forEach(function(square, ind) {
    Object.keys(square).forEach(function(e) {
      if ((e === 'width') || (e === 'height') || (e === 'left') || (e === 'top')) return;
      pjson.squares[ind] = updateProperty(e, square, pjson);
    });
  });
  Object.keys(pjson.background).forEach(function(e) {
    pjson.background = updateProperty(e, pjson.background, pjson)
  })
}

var updateProperty = function (name, obj, pjson) {
  if ((name === 'selector') || (name === 'width') || (name === 'height')) return obj;

  var maxy = 0;
  var miny = 0;
  if ( ((name === 'red') || (name ===  'green') || (name === 'blue')) ||
    ((name === 'bRed') || (name === 'bGreen') ||  (name === 'bBlue')) ) {
    maxy = 255;
    miny = 0;
  } else if ((name === 'top') || (name === 'left')) {
    var offset = Math.round(obj.size.val / 2);
    maxy = pjson.pageWidth - offset - (obj.size.del);
    if (name === 'top') maxy = pjson.pageHeight - offset - (obj.size.del);
    miny = 0 - offset - (obj.size.del);
  } else if (name === 'size') {
    maxy = MAXCIRCLESIZE;
    miny = MINSIZE;
  } else if (name === 'borderWidth') {
    miny = 3;
    maxy = Math.floor(MAXCIRCLESIZE * 0.15);
  }

  if (obj[name].streak <= 0) {
    obj[name].streak = minToMax(MINSTREAK, MAXSTREAK) + 1;
    obj[name].del = plusOrMinus();
  }
  obj[name].streak--;
  
  var upDVal = obj[name].val + (pjson.delta * obj[name].del);
  if ((upDVal > maxy) || (upDVal < miny)) obj[name].del = obj[name].del * -1;
  obj[name].val = obj[name].val + (pjson.delta * obj[name].del);

  return obj;
}

var redrawPage = function() {
  var $cray = $('#cray');

  update(pageson);
  $cray.children().remove();
  pageson.circles.forEach( function(e) {
    var backG = '';
    backG = 'background-color: rgb(' +
      e.red.val + ', ' + e.green.val + ', ' + e.blue.val +
      '); ';
    if (pageson.usePics) backG = 'background-image: url(pics/' + e.background.pic + '); ';
    $cray.append('<div class="circle ' + e.selector +
      '" style="width: ' + e.size.val +
      'px; height: ' + e.size.val +
      'px; top: ' + e.top.val +
      'px; left: ' + e.left.val +
      'px; ' + backG + 'border: ' + e.borderWidth.val + 'px solid rgb(' +
      e.bRed.val + ', ' + e.bGreen.val + ', ' + e.bBlue.val +');"></div>');
  });
  pageson.squares.forEach( function(e) {
    $cray.append('<div class="square ' + e.selector +
      '" style="width: ' + e.width.val +
      'px; height: ' + e.height.val +
      'px; top: ' + e.top.val +
      'px; left: ' + e.left.val +
      'px; background-color: rgb(' +
      e.red.val + ', ' + e.green.val + ', ' + e.blue.val +
      '); border: ' + e.borderWidth.val + 'px solid rgb(' +
      e.bRed.val + ', ' + e.bGreen.val + ', ' + e.bBlue.val +');"></div>');
  });
  $cray.css({'background-color': 'rgb(' +
    pageson.background.red.val + ', ' +
    pageson.background.green.val + ', ' +
    pageson.background.blue.val + ')'});
  $cray.css({'height': pageson.pageHeight + 70 + 'px'})
}


jsonCircles(20, pageson);
jsonSquares(pageson);
var intervalID = setInterval(redrawPage, pageson.ms);

$('.button').on('click', function(e) {
  if (e.target.id === 'settingsModal') {
    clearInterval(intervalID);
    intervalID = setInterval(redrawPage, 500);
    $('#settingsModal').css({'display': 'none'});
    $('.modal').css({'display': 'block', 'height': window.innerHeight});
  } else if (e.target.id === 'closeModal') {
    $('#settingsModal').css({'display': 'block'});
    $('.modal').css({'display': 'none'});
    clearInterval(intervalID)
    intervalID = setInterval(redrawPage, pageson.ms);
  } else if (e.target.id === 'addCircle') {
    jsonCircles(1, pageson);
  } else if (e.target.id === 'removeCircle') {
    jsonCircles(-1, pageson);
  } else if (e.target.id === 'submitCircle') {
    jsonCircles(0, pageson);
    jsonCircles(parseInt($('#theCircle').val()), pageson);
  } else if (e.target.id === 'backToggle') {
    if (pageson.usePics === false) { 
      pageson.usePics = true;
    } else {
      pageson.usePics = false;
    }
  } else if (e.target.id === 'submitFrames') {
    pageson.ms = $('#theFrames').val();
  } else if (e.target.id === 'submitDelta') {
    pageson.delta = $('#theDelta').val();
  }
});

/**
 _____ _____ ____ _____ ____  
|_   _| ____/ ___|_   _/ ___| 
  | | |  _| \___ \ | | \___ \ 
  | | | |___ ___) || |  ___) |
  |_| |_____|____/ |_| |____/ 
                              
**/

//Input the number of iterations to check the result for bias
var plusOrMinus_Test = function(iterations) {
  var plusOne = 0;
  var minusOne = 0;
  for (var i = 0; i < iterations; i++) {
    var res = plusOrMinus();
    if (res > 0) {
      plusOne++;
    } else {
      minusOne++;
    }
  }
  console.log('plusOne: ' + plusOne, 'minusOne: ' + minusOne);
}

//Input the number of iterations, the min streak length, and max to check result
//for bias
var minToMax_test = function(iterations, min, max) {
  var ret = [];
  for (var i = 0; i <= max - min; i++) {
    ret.push(0);
  }

  for (var i = 0; i < iterations; i++) {
    var res = minToMax(min, max);
    ret[res-min] = ret[res-min] + 1;
  }
  console.log(ret);
}

var getVal_test = function(){
  $('body').append('<div class="test">test</div>');
  console.log('done appending')
  console.log('test.color: rgb(222, 211, 200)', getVal('.test', 'color'))
  console.log('test.background-color: rgb(255, 244, 233)', getVal('.test', 'background-color'))
  console.log('test.z-index: 4', getVal('.test', 'z-index'))
  console.log('test.top: 2px', getVal('.test', 'top'))
  console.log('test.left: ~' + 16 * 3 + 'px', getVal('.test', 'left'))
  console.log('test.width: ~' + $('body').width() * 0.3 + 'px', getVal('.test', 'width'))
  $('.test').remove()
  console.log('div removed')
}

var makeRandomColor_test = function (iterations) {
  var res = {};
  for (var i = 0; i < iterations; i++) {
    var rgb = makeRandomColor();
    rgb.forEach( function(e) {
      res[e]? res[e]++: res[e] = 1;
    })
  }
  var min = iterations;
  var minE = '';
  var max = 0;
  var maxE = '';
  Object.keys(res).forEach(function(e) {
    if (res[e] <= min) { min = res[e]; minE = e; };
    if (res[e] >= max) { max = res[e]; maxE = e; };
    if (parseInt(e) > 255 || e < 0) console.log('ERROR, color out of bounds')
  });

  console.log('Min and max values in our color array are: ' + min + ', ' + max + '.');
  console.log('They belong to: ' + minE + ', and ' + maxE + ', respectively.');
}

var runTests = function () {
  plusOrMinus_Test(1000);
  minToMax_test(1000, 3, 9);
  makeRandomColor_test(100000);
  getVal_test();
}
