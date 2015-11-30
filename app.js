/**
  ____ _     ___  ____    _    _      __     ___    ____  ____
 / ___| |   / _ \| __ )  / \  | |     \ \   / / \  |  _ \/ ___|
| |  _| |  | | | |  _ \ / _ \ | |      \ \ / / _ \ | |_) \___ \
| |_| | |__| |_| | |_) / ___ \| |___    \ V / ___ \|  _ < ___) |
 \____|_____\___/|____/_/   \_\_____|    \_/_/   \_\_| \_\____/

**/

var MINCIRCLES = 25;
var MAXCIRCLES = 35;
var CIRCLENUM = 0;
var MINSIZE = 50;
var MAXCIRCLESIZE = 150;
var MINSTREAK = 30; //in fps
var MAXSTREAK = 120;
var DELTA = 2;

var pagewidth = $(window).width();
var pageheight = $(window).height() - 100;
var margin = Math.floor(pagewidth * 0.03);
var damargin = (margin * 6);

var maxPrimeWidth = Math.floor(pagewidth * 0.4);
var minPrimeWidth = Math.floor(pagewidth * 0.3);
var maxWidth = Math.floor(pagewidth * 0.25);
var minWidth = Math.floor(pagewidth * 0.2);

var maxPrimeHeight = Math.floor( (pageheight - damargin) * 0.4);
var minPrimeHeight = Math.floor( (pageheight - damargin) * 0.3);
var maxHeight = Math.floor((pageheight - damargin) * 0.25);
var minHeight = Math.floor((pageheight - damargin) * 0.2);

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
  circles: []
};


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
};

//produces round number between min and max with even distribution
var minToMax = function(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
};

CIRCLENUM = minToMax(MINCIRCLES, MAXCIRCLES);

var jsonBackground = function(pjson) {
  pjson.background = {
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
};


//creates the circles that will move randomly about the page, and gives them
//initial locations, and sizes
//returns an object with their relevant data
var appendCircles = function(circleCount) {

  for (var i = 0; i < circleCount; i++) {
    var selector = 'b' + i;
    $('body').append('<div class="circle ' + selector + '"></div>');

    var size = minToMax(MINSIZE, MAXCIRCLESIZE);
    var offset = Math.round(size/2);
    var top = minToMax( 0 - offset, pageheight - offset );
    var left = minToMax( 0 - offset, pagewidth - offset );
    var cNums = makeRandomColor();

    $('.' + selector).css({
      'width': size + 'px',
      'height': size + 'px',
      'top': top + 'px',
      'left': left + 'px',
      'background-color': 'rgb('+ cNums[0] + ', '+ cNums[1] + ', '+ cNums[2] + ')'
    });

    pageson.circles.push({
      selector: selector,
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
};

var jsonSquares = function(pjson) {
var cNums = makeRandomColor();

  for (var i = 0; i < 9; i++) {
    var cNums = makeRandomColor();
    pjson.squares.push({
      selector: 'a' + i,
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
        var width = pagewidth - damargin - primeWidth - midWidth;
      }
      pjson.squares[index].width.val = width;
    });

    for (var k = 0; k < 3; k++) {
      var ind = k + (i * 3);
      if (k === 0) {
        pjson.squares[ind].left.val = 0;
      } else if (k === 1) {
        pjson.squares[ind].left.val = (margin * 2) +
          pjson.squares[ind - 1].width.val;
      } else {
        pjson.squares[ind].left.val = (margin * 4) +
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
        var height = pageheight - damargin - primeHeight - midHeight;
      }
      pjson.squares[index].height.val = height;
    });

    for (var i = 0; i < 3; i++) {
      for (var k = 0; k < 3; k++) {
        var ind = (i * 3) + k;
        if (i === 0) {
          pjson.squares[ind].top.val = 0;
        } else if (i === 1) {
          pjson.squares[ind].top.val = (margin * 2) +
            pjson.squares[ind - 3].height.val;
        } else {
          pjson.squares[ind].top.val = (margin * 4) +
            pjson.squares[ind - 3].height.val +
            pjson.squares[ind - 6].height.val;
        }
      }
    }
  });
};

var makeRandomColor = function() {
  return [minToMax(0,255), minToMax(0,255), minToMax(0,255)];
};

var update = function(pjson) {
  pjson.circles.forEach(function(circle, ind) {
    Object.keys(circle).forEach(function(e) {
      pjson.circles[ind] = updateProperty(e, circle);
    });
  });
  pjson.squares.forEach(function(square, ind) {
    Object.keys(square).forEach(function(e) {
      if ((e === 'width') || (e === 'height') || (e === 'left') || (e === 'top')) return;
      pjson.squares[ind] = updateProperty(e, square);
    });
  });
  Object.keys(pjson.background).forEach(function(e) {
    pjson.background = updateProperty(e, pjson.background)
  });

  Object.keys(pjson.widthPriority).forEach(function(e, i) {
    var primeWidth = 0;
    var midWidth = 0;

    pjson.widthPriority[e].forEach(function(r, j) {
      var index = parseInt(r.slice(1));
      var obj = pjson.squares[index];

      if (j === 0) { //PRIME
        var width = obj.width.val + (DELTA * obj.width.del);
        if ( (width > maxPrimeWidth) || (width < minPrimeWidth) ) obj.width.del = obj.width.del * -1;
        var upDWidth = obj.width.val + (DELTA * obj.width.del);
        primeWidth = width;
      } else if (j === 1) { //SECOND PRIME
        var width = obj.width.val + (DELTA * obj.width.del);
        if ( (width > maxWidth) || (width < minWidth) ) obj.width.del = obj.width.del * -1;
        var upDWidth = obj.width.val + (DELTA * obj.width.del);
        midWidth = width;
      } else { //SHRINKYDINK
        var upDWidth = pagewidth - damargin - primeWidth - midWidth;
      }

      pjson.squares[index].width.val = upDWidth;
      pjson.squares[index].width.streak--;
      if (pjson.squares[index].width.streak === 0) {
        pjson.squares[index].width.streak = minToMax(MINSTREAK, MAXSTREAK);
        pjson.squares[index].width.del = minToMax(-1, 1);
      }
    });

    for (var k = 0; k < 3; k++) {
      var ind = k + (i * 3);
      if (k === 0) {
        pjson.squares[ind].left.val = 0;
      } else if (k === 1) {
        pjson.squares[ind].left.val = (margin * 2) +
          pjson.squares[ind - 1].width.val;
      } else {
        pjson.squares[ind].left.val = (margin * 4) +
          pjson.squares[ind - 1].width.val +
          pjson.squares[ind - 2].width.val;
      }
    }
  });

  // Object.keys(pjson.heightPriority).forEach(function(e, i) {
  //   var primeHeight = 0;
  //   var midHeight = 0;

  //   pjson.heightPriority[e].forEach(function(r, j) {
  //     var index = parseInt(r.slice(1));
  //     var obj = pjson.squares[index];

  //     if (j === 0) {
  //       var height = obj.height.val + (DELTA * obj.height.del);
  //       if ( (height > maxPrimeHeight) || (height < minPrimeHeight) ) obj.height.del = obj.height.del * -1;
  //       var upDHeight = obj.height.val + (DELTA * obj.height.del);
  //       primeHeight = height;
  //     } else if (j === 2) {
  //       var width = obj.height.val + (DELTA * obj.height.del);
  //       if ( (height > maxHeight) || (height < minHeight) ) obj.height.del = obj.height.del * -1;
  //       var upDHeight = obj.height.val + (DELTA * obj.height.del);
  //       midHeight = height;
  //     } else {
  //       var upDHeight = pageheight - damargin - primeHeight - midHeight;
  //     }

  //     pjson.squares[index].height.val = upDHeight;
  //     pjson.squares[index].height.streak--;
  //     if (pjson.squares[index].height.streak === 0) {
  //       pjson.squares[index].height.streak = minToMax(MINSTREAK, MAXSTREAK);
  //       pjson.squares[index].height.del = minToMax(-1, 1);
  //     }
  //   });

  //   for (var i = 0; i < 3; i++) {
  //     for (var k = 0; k < 3; k++) {
  //       var ind = (i * 3) + k;
  //       if (i === 0) {
  //         pjson.squares[ind].top.val = 0;
  //       } else if (i === 1) {
  //         pjson.squares[ind].top.val = (margin * 2) +
  //           pjson.squares[ind - 3].height.val;
  //       } else {
  //         pjson.squares[ind].top.val = (margin * 4) +
  //           pjson.squares[ind - 3].height.val +
  //           pjson.squares[ind - 6].height.val;
  //       }
  //     }
  //   }
  // });
};

var updateProperty = function (name, obj) {
  if ((name === 'selector') || (name === 'width') || (name === 'height')) return obj;

  var maxy = 0;
  var miny = 0;
  if ((name === 'red') || (name ===  'green') || (name === 'blue')) {
    maxy = 255;
    miny = 0;
  } else if ((name === 'top') || (name === 'left')) {
    var offset = Math.round(obj.size.val / 2);
    maxy = pagewidth - offset;
    if (name === 'top') maxy = pageheight - offset;
    miny = 0 - offset;
  } else if (name === 'size') {
    maxy = MAXCIRCLESIZE;
    miny = MINSIZE;
  }

  if (obj[name].streak <= 0) {
    obj[name].streak = minToMax(MINSTREAK, MAXSTREAK);
    obj[name].del = plusOrMinus();
  } else {
    obj[name].streak--;
  }
  var upDVal = obj[name].val + (DELTA * obj[name].del);
  if ((upDVal > maxy) || (upDVal < miny)) obj[name].del = obj[name].del * -1;
  obj[name].val = obj[name].val + (DELTA * obj[name].del);

  return obj;
}

var redrawPage = function() {
  var $body = $('body');

  update(pageson);
  $body.children().remove();
  var appendString = '';
  pageson.circles.forEach( function(e) {
    $body.append('<div class="circle ' + e.selector +
      '" style="width: ' + e.size.val +
      'px; height: ' + e.size.val +
      'px; top: ' + e.top.val +
      'px; left: ' + e.left.val +
      'px; background-color: rgb(' +
      e.red.val + ', ' + e.green.val + ', ' + e.blue.val + ');"></div>');
  });
  pageson.squares.forEach( function(e) {
    $body.append('<div class="square ' + e.selector +
      '" style="width: ' + e.width.val +
      'px; height: ' + e.height.val +
      'px; top: ' + e.top.val +
      'px; left: ' + e.left.val +
      'px; background-color: rgb(' +
      e.red.val + ', ' + e.green.val + ', ' + e.blue.val + ');"></div>');
  });
  $body.css({'background-color': 'rgb(' +
      pageson.background.red.val + ', ' +
      pageson.background.green.val + ', ' +
      pageson.background.blue.val + ')'});
  pagewidth = $body.width();
}


appendCircles(CIRCLENUM);
jsonSquares(pageson);
jsonBackground(pageson);
setInterval(redrawPage, 13);


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

var appendCircles_test = function(val) {
  appendCircles(val);
  if ($('.circle').length === val) console.log('Correctly appended ' + val + ' circles.');
  if (pageson.circles.length === val) console.log('Site JSON recieved ' + val + ' circles');
  if ( (pageson.circles[5].selector === 'b5') &&
      (typeof pageson.circles[5].size.val === "number") &&
      (typeof pageson.circles[5].top.val === "number") &&
      (typeof pageson.circles[5].left.val === "number") &&
      (typeof pageson.circles[5].red.val === "number") &&
      (typeof pageson.circles[5].green.val === "number") &&
      (typeof pageson.circles[5].blue.val === "number") &&
      (typeof pageson.circles[5].size.del === "number") &&
      (typeof pageson.circles[5].top.del === "number") &&
      (typeof pageson.circles[5].left.del === "number") &&
      (typeof pageson.circles[5].red.del === "number") &&
      (typeof pageson.circles[5].green.del === "number") &&
      (typeof pageson.circles[5].blue.del === "number") &&
      (typeof pageson.circles[5].size.streak === "number") &&
      (typeof pageson.circles[5].top.streak === "number") &&
      (typeof pageson.circles[5].left.streak === "number") &&
      (typeof pageson.circles[5].red.streak === "number") &&
      (typeof pageson.circles[5].green.streak === "number") &&
      (typeof pageson.circles[5].blue.streak === "number")
      ) console.log('All data appended to circles as well.');
  $('.circle').remove();
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
  appendCircles_test(30);
  makeRandomColor_test(100000);
}
