window.requestAnimFrame = function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback);
    }
  );
};

function init(elemid) {
  let canvas = document.getElementById(elemid),
    c = canvas.getContext("2d"),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight);
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
  return { c: c, canvas: canvas };
}

window.onload = function () {
  let c = init("canvas").c,
    canvas = init("canvas").canvas,
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight),
    mouse = { x: false, y: false },
    last_mouse = {};

  function dist(p1x, p1y, p2x, p2y) {
    return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
  }

  class segment {
    constructor(parent, l, a, first) {
      this.first = first;
      if (first) {
        this.pos = {
          x: parent.x,
          y: parent.y
        };
      } else {
        this.pos = {
          x: parent.nextPos.x,
          y: parent.nextPos.y
        };
      }
      this.l = l;
      this.ang = a;
      this.nextPos = {
        x: this.pos.x + this.l * Math.cos(this.ang),
        y: this.pos.y + this.l * Math.sin(this.ang)
      };
    }
    update(t) {
      this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
      this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
      this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
      this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
      this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }
    fallback(t) {
      this.pos.x = t.x;
      this.pos.y = t.y;
      this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
      this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }
    show() {
      c.lineTo(this.nextPos.x, this.nextPos.y);
    }
  }

  class tentacle {
    constructor(x, y, l, n, a) {
      this.x = x;
      this.y = y;
      this.l = l;
      this.n = n;
      this.t = {};
      this.rand = Math.random();
      this.segments = [new segment(this, this.l / this.n, 0, true)];
      for (let i = 1; i < this.n; i++) {
        this.segments.push(
          new segment(this.segments[i - 1], this.l / this.n, 0, false)
        );
      }
    }
    move(last_target, target) {
      this.angle = Math.atan2(target.y - this.y, target.x - this.x);
      this.dt = dist(last_target.x, last_target.y, target.x, target.y) + 5;
      this.t = {
        x: target.x - 0.8 * this.dt * Math.cos(this.angle),
        y: target.y - 0.8 * this.dt * Math.sin(this.angle)
      };
      if (this.t.x) {
        this.segments[this.n - 1].update(this.t);
      } else {
        this.segments[this.n - 1].update(target);
      }
      for (let i = this.n - 2; i >= 0; i--) {
        this.segments[i].update(this.segments[i + 1].pos);
      }
      if (
        dist(this.x, this.y, target.x, target.y) <=
        this.l + dist(last_target.x, last_target.y, target.x, target.y)
      ) {
        this.segments[0].fallback({ x: this.x, y: this.y });
        for (let i = 1; i < this.n; i++) {
          this.segments[i].fallback(this.segments[i - 1].nextPos);
        }
      }
    }
    show(target) {
      if (dist(this.x, this.y, target.x, target.y) <= this.l) {
        c.globalCompositeOperation = "lighter";
        c.beginPath();
        c.lineTo(this.x, this.y);
        for (let i = 0; i < this.n; i++) {
          this.segments[i].show();
        }
        c.strokeStyle = "rgb(204, 0, 255)";
        c.lineWidth = this.rand * 2;
        c.lineCap = "round";
        c.lineJoin = "round";
        c.stroke();
        c.globalCompositeOperation = "source-over";
      }
    }
    show2(target) {
      c.beginPath();
      if (dist(this.x, this.y, target.x, target.y) <= this.l) {
        c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
        c.fillStyle = "white";
      } else {
        c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
        c.fillStyle = "darkcyan";
      }
      c.fill();
    }
  }

  let maxl = 200,
    minl = 50,
    n = 30,
    numt = 500,
    tent = [],
    clicked = false,
    target = { x: 0, y: 0 },
    last_target = {},
    t = 0,
    q = 10;

  for (let i = 0; i < numt; i++) {
    tent.push(
      new tentacle(
        Math.random() * w,
        Math.random() * h,
        Math.random() * (maxl - minl) + minl,
        n,
        Math.random() * 2 * Math.PI
      )
    );
  }
  function draw() {
    if (mouse.x) {
      target.errx = mouse.x - target.x;
      target.erry = mouse.y - target.y;
    } else {
      target.errx =
        w / 2 +
        ((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
          (Math.pow(Math.sin(t), 2) + 1) -
        target.x;
      target.erry =
        h / 2 +
        ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
          (Math.pow(Math.sin(t), 2) + 1) -
        target.y;
    }

    target.x += target.errx / 30;
    target.y += target.erry / 30;

    t += 0.01;

    c.beginPath();
    c.arc(
      target.x,
      target.y,
      dist(last_target.x, last_target.y, target.x, target.y) + 5,
      0,
      2 * Math.PI
    );
    c.fillStyle = "rgb(255, 192, 203)";
    c.fill();

    for (i = 0; i < numt; i++) {
      tent[i].move(last_target, target);
      tent[i].show2(target);
    }
    for (i = 0; i < numt; i++) {
      tent[i].show(target);
    }
    last_target.x = target.x;
    last_target.y = target.y;
  }

  canvas.addEventListener(
    "mousemove",
    function (e) {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;

      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    },
    false
  );

  canvas.addEventListener("mouseleave", function (e) {
    mouse.x = false;
    mouse.y = false;
  });

  canvas.addEventListener(
    "mousedown",
    function (e) {
      clicked = true;
    },
    false
  );

  canvas.addEventListener(
    "mouseup",
    function (e) {
      clicked = false;
    },
    false
  );

  function loop() {
    window.requestAnimFrame(loop);
    c.clearRect(0, 0, w, h);
    draw();
  }

  window.addEventListener("resize", function () {
    (w = canvas.width = window.innerWidth),
      (h = canvas.height = window.innerHeight);
    loop();
  });

  loop();
  setInterval(loop, 1000 / 60);
};
$(document).ready(function(){
    const menu = $(".menu");
    const menuItem = $(".menu__item");
    const hamburger = $(".hamburger");
    const light = $(".menu__top__img");

    hamburger.click(function(){
        hamburger.toggleClass('hamburger_active');
        menu.toggleClass('menu_active');
        light.each(function(){
            $(this).toggleClass('menu__top__img_active');
        });
    });

    menuItem.each(function(){
        $(this).click(function(){
            hamburger.toggleClass('hamburger_active');
            menu.toggleClass('menu_active');
            light.each(function(){
                $(this).toggleClass('menu__top__img_active');
            });
        });
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.menu').length && !$(event.target).closest('.hamburger').length) {
            if (menu.hasClass('menu_active')) {
                hamburger.removeClass('hamburger_active');
                menu.removeClass('menu_active');
                light.each(function(){
                    $(this).removeClass('menu__top__img_active');
                });
            }
        }
    });
});


let menuItems = document.querySelectorAll('.hobby__menu__item');
let turnButton = document.querySelector('.hobby__present__btn');
let blocks = document.querySelectorAll('.hobby__present__inner');
let gifs = document.querySelectorAll('.hobby__present__gif');

let currentIndex = 0; // External variable to store the current index

// Add event listeners for each li element
menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        activateBlock(index);
    });
});

turnButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % blocks.length;
    activateBlock(currentIndex);
});

function activateBlock(index) {
    // Remove the active class from all blocks
    menuItems.forEach(block => block.classList.remove('hobby__menu__item_active'));
    blocks.forEach(block => block.classList.remove('hobby__present__inner_active'));

    // Update the current index
    currentIndex = index;

    // Add the active class to the selected block
    menuItems[index].classList.add('hobby__menu__item_active');
    blocks[index].classList.add('hobby__present__inner_active');

    // Rotate the button
    turnButton.style.transform = `rotate(${45 * currentIndex}deg)`;

    // Add the active class to the gif and remove it after 2 seconds
    gifs[index].classList.add('hobby__present__gif_active');
    setTimeout(() => {
        gifs[index].classList.remove('hobby__present__gif_active');
    }, 500);
}

/* window.addEventListener('DOMContentLoaded', () => {
    const hobby = document.querySelector('.hobby'),
    hobbyIn = document.querySelector('.hobby__inner'),
    lightR = document.querySelectorAll('.hobby__img__light_red'),
    btn = document.querySelector('.hobby__img__btn'),
    lightG = document.querySelectorAll('.hobby__img__light_green'),
    bottom = document.querySelector('.hobby__bottom');
    btn.addEventListener('click', () => {
        
        hobby.classList.toggle('hobby_active'),
        btn.classList.toggle('hobby__img__btn_active'),
        
        hobbyIn.classList.toggle('hobby__inner_active'),
        bottom.classList.toggle('hobby__bottom_active'),
        lightR.forEach(light => {
          light.classList.toggle('hobby__img__light_red_active');
        });
        
        lightG.forEach(light => {
            light.classList.toggle('hobby__img__light_green_active');
        });
        
    });
    
    
}) */
window.addEventListener('DOMContentLoaded', () => {
    const hobby = document.querySelector('.hobby');
    const btn = document.querySelector('.hobby__img__btn');
    const table = document.querySelector('.hobby__table');
    const hobbyIn = document.querySelector('.hobby__inner');
    const bottom = document.querySelector('.hobby__bottom');
    const lightR = document.querySelectorAll('.hobby__img__light_red');
    const lightG = document.querySelectorAll('.hobby__img__light_green');

    btn.addEventListener('click', () => {
        toggleClasses();
    });
    table.addEventListener('click', () => {
        toggleClasses();
    });
    function toggleClasses() {
        hobby.classList.toggle('hobby_active');
        btn.classList.toggle('hobby__img__btn_active');
        table.classList.toggle('hobby__table_active');
        hobbyIn.classList.toggle('hobby__inner_active');
        bottom.classList.toggle('hobby__bottom_active');

        lightR.forEach(light => {
            light.classList.toggle('hobby__img__light_red_active');
        });

        lightG.forEach(light => {
            light.classList.toggle('hobby__img__light_green_active');
        });

        if (!btn.classList.contains('hobby__img__btn_active')) {
            bottom.classList.add('hobby__bottom_back');
            hobbyIn.classList.add('hobby__inner_back');
        } 
        else if (!table.classList.contains('hobby__table_active')) {
            bottom.classList.add('hobby__bottom_back');
            hobbyIn.classList.add('hobby__inner_back');
        }
        else {
            bottom.classList.remove('hobby__bottom_back');
            hobbyIn.classList.remove('hobby__inner_back');
        }
    }
});
  $(window).scroll(function(){
    if ($(this).scrollTop()>800){
      $('.pageup').fadeIn();
    }
    else{
      $('.pageup').fadeOut();
    }
  });
  /*
  $("a[href=#up]").click(function(){
    const _href = $(this).attr("href");
    $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
    return false;
  })
$(document).ready(function(){
    $("a.menu__link").click(function(){
        const _href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
        return false;
    });
});

window.onload = function(){
    $("ul.menu").on("click", "a.menu__link", function(event){
        event.preventDefault();
        const _href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
    });
}; */


