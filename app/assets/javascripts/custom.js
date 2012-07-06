jQuery.noConflict();

jQuery(document).ready(function(){

  //k_form(); //controls the contact form
  k_menu(); // controls the dropdown menu
  k_pixelperfect();


  // accordion slider
  jQuery("#featured").not('.fadeslider, .newsslider').kricordion({
    slides: '.featured',		// wich element inside the container should serve as slide
    animationSpeed: 900,		// animation duration in milliseconds
    autorotation: true,			// autorotation true or false?
    autorotationSpeed:5,		// duration between autorotation switch in Seconds
    event: 'mouseover',			// event to focus a slide: mouseover or click
    imageShadow:true,			// should the image get a drop shadow to the left
    imageShadowStrength:0.5		// how dark should that shadow be, recommended values: between 0.3 and 0.8, allowed between 0 and 1
  });


  // fading slider
  jQuery('.fadeslider').kriesi_fade_slider({
    slides: '.featured',				// wich element inside the container should serve as slide
    animationSpeed: 900,				// animation duration in milliseconds
    autorotation: true,					// autorotation true or false?
    autorotationSpeed:5,				// duration between autorotation switch in Seconds
    appendControlls: '#feature_wrap'	//element to append the controlls to
  });


  // news slider
  jQuery('.newsslider').kriesi_news_slider({
    slides: '.featured',				// wich element inside the container should serve as slide
    animationSpeed: 900,				// animation duration in milliseconds
    autorotation: true,					// autorotation true or false?
    autorotationSpeed:5					// duration between autorotation switch in Seconds
  });

  jQuery('.ajax_form').kriesi_ajax_form();	// activates contact form
  jQuery('.news_form').kriesi_ajax_form();	// activates news submit form
  jQuery('#main').kriesi_image_preloader({delay:200});	// activates preloader for non-slideshow images
  jQuery('input:text').kriesi_empty_input();	// comment form improvement
});


// -------------------------------------------------------------------------------------------
// input field improvements
// -------------------------------------------------------------------------------------------

(function($)
 {
   $.fn.kriesi_empty_input = function(options) 
{
  return this.each(function()
    {
      var currentField = $(this);
      currentField.methods = 
  {
    startingValue:  currentField.val(),

         resetValue: function()
  {	
    var currentValue = currentField.val();
    if(currentField.methods.startingValue == currentValue) currentField.val('');
  },

         restoreValue: function()
  {	
    var currentValue = currentField.val();
    if(currentValue == '') currentField.val(currentField.methods.startingValue);
  }
  };

  currentField.bind('focus',currentField.methods.resetValue);
  currentField.bind('blur',currentField.methods.restoreValue);
    });
}
})(jQuery);	



// -------------------------------------------------------------------------------------------
// The Image preloader
// -------------------------------------------------------------------------------------------


(function($)
 {
   $.fn.kriesi_image_preloader = function(options) 
{
  var defaults = 
{
  repeatedCheck: 500,
  fadeInSpeed: 1000,
  delay:600,
  callback: ''
};

var options = $.extend(defaults, options);

return this.each(function()
  {
    var imageContainer = jQuery(this),
       images = imageContainer.find('img').css({opacity:0, visibility:'hidden'}),
       imagesToLoad = images.length;				

imageContainer.operations =
{	
  preload: function()
{	
  var stopPreloading = true;

  images.each(function(i, event)
    {	
      var image = $(this);


      if(event.complete == true)
  {	
    imageContainer.operations.showImage(image);
  }
      else
  {
    image.bind('error load',{currentImage: image}, imageContainer.operations.showImage);
  }

    });

  return this;
},

  showImage: function(image)
{	
  imagesToLoad --;
  if(image.data.currentImage != undefined) { image = image.data.currentImage;}

  if (options.delay <= 0) image.css('visibility','visible').animate({opacity:1}, options.fadeInSpeed);

  if(imagesToLoad == 0)
  {
    if(options.delay > 0)
    {
      images.each(function(i, event)
          {	
            var image = $(this);
            setTimeout(function()
              {	
                image.css('visibility','visible').animate({opacity:1}, options.fadeInSpeed);
              },
              options.delay*(i+1));
          });

      if(options.callback != '')
      {
        setTimeout(options.callback, options.delay*images.length);
      }
    }
    else if(options.callback != '')
    {
      (options.callback)();
    }

  }

}

};

imageContainer.operations.preload();
});

}
})(jQuery);



// -------------------------------------------------------------------------------------------
// The Fade Slider
// -------------------------------------------------------------------------------------------

(function($)
 {
   $.fn.kriesi_fade_slider= function(options) 
{
  var defaults = 
{
  slides: '>div',				// wich element inside the container should serve as slide
  animationSpeed: 900,		// animation duration
  autorotation: true,			// autorotation true or false?
  autorotationSpeed:3,		// duration between autorotation switch in Seconds
  appendControlls: '',
  backgroundOpacity:0.8		// opacity for background
};

var options = $.extend(defaults, options);

return this.each(function()
  {
    var slideWrapper 	= $(this),								
       slides			= slideWrapper.find(options.slides).css({display:'none',zIndex:0}),
       slideCount 	= slides.length,
       currentSlideNumber = 0,
       interval,
       current_class = 'active_item',
       controlls = '',
       skipSwitch = true;

slides.find('.feature_excerpt').css('opacity',options.backgroundOpacity);

slideWrapper.methods = {

  init: function()
{
  slides.filter(':eq(0)').css({zIndex:2, display:'block'});

  if(slideCount <= 1)
{
  slideWrapper.kriesi_image_preloader({delay:200});
}
else
{
  slideWrapper.kriesi_image_preloader({callback:slideWrapper.methods.preloadingDone, delay:200});

  if (options.appendControlls)
  {
    controlls = $('<div></div>').addClass('slidecontrolls').css({position:'absolute'}).appendTo(options.appendControlls);
    slides.each(function(i)
        {	
          var controller = $('<span class="ie6fix '+current_class+'"></span>').appendTo(controlls);
          controller.bind('click', {currentSlideNumber: i}, slideWrapper.methods.switchSlide);
          current_class = "";
        });	
  }
}						
},

  preloadingDone: function()
{
  skipSwitch = false;

  if(options.autorotation)
  {
    slideWrapper.methods.autorotate();
  }
},

  switchSlide: function(passed)
{	
  var noAction = false;


  if(passed != undefined && !skipSwitch)
  {	
    if(currentSlideNumber != passed.data.currentSlideNumber)
    {	
      currentSlideNumber = passed.data.currentSlideNumber;
    }
    else
    {
      noAction = true;
    }
  }

  if(passed != undefined)
  {	
    clearInterval(interval);
  }

  if(!skipSwitch && noAction == false)
  {	
    skipSwitch = true;
    var currentSlide = slides.filter(':visible'),
        nextSlide = slides.filter(':eq('+currentSlideNumber+')');
            if(options.appendControlls)
            {	
              controlls.find('.active_item').removeClass('active_item');
              controlls.find('span:eq('+currentSlideNumber+')').addClass('active_item');									
                }

                currentSlide.css({zIndex:4});	
                nextSlide.css({zIndex:2, display:'block'});

                currentSlide.fadeOut(options.animationSpeed, function()
                  {
                    currentSlide.css({zIndex:0, display:"none"});
                    skipSwitch = false;
                  });
                }
                },

                autorotate: function()
                {	
                  interval = setInterval(function()
                    { 	
                      currentSlideNumber ++;
                      if(currentSlideNumber == slideCount) currentSlideNumber = 0;

                      slideWrapper.methods.switchSlide();
                    },
                    (parseInt(options.autorotationSpeed) * 1000));
                }

};

slideWrapper.methods.init();
});

}
})(jQuery);

// -------------------------------------------------------------------------------------------
// The News Slider
// -------------------------------------------------------------------------------------------

(function($)
 {
   $.fn.kriesi_news_slider= function(options) 
{
  var defaults = 
{
  slides: '>div',				// wich element inside the container should serve as slide
  animationSpeed: 900,		// animation duration
  autorotation: true,			// autorotation true or false?
  autorotationSpeed:3,		// duration between autorotation switch in Seconds
  easing: 'easeOutQuint',
  backgroundOpacity:0.8		// opacity for background
};

var options = $.extend(defaults, options);

return this.each(function()
  {
    var slideWrapper 	= $(this),								
       slides			= slideWrapper.find(options.slides).css({display:'none',zIndex:0}),
       slideCount 	= slides.length,
       accelerator = 0,				// accelerator of scrolling speed
       scrollInterval = '',			// var that stores the setInterval id
       mousePos = '',					// current mouse position
       moving = false,					// scrollbar currently moving or not?
       controllWindowHeight = 0,		// height of the wrapping element that hides overflow
       controllWindowPart = 0,			// mouseoverpart of the wrapping element that hides overflow
       itemWindowHeight = 0,			// height of element to move
       current_class = 'active_item',
       skipSwitch = true,
       currentSlideNumber = 0,
       newsSelect ='',
       newsItems = '';	

slides.find('.feature_excerpt').css('opacity',options.backgroundOpacity);			

slideWrapper.methods = {

  init: function()
  {
    newsSelect = $('<div></div>').addClass('newsselect').appendTo(slideWrapper);
    newsItems = $('<div></div>').addClass('newsItems').appendTo(newsSelect);
    fadeout = $('<div></div>').addClass('fadeout').addClass('ie6fix').appendTo(slideWrapper);

    slides.filter(':eq(0)').css({zIndex:2, display:'block'});

    slides.each(function(i)
        {	
          var slide = $(this),
      url = slide.find('a').attr('href'),
      controll = $('<a class="single_item '+current_class+'"></a>').appendTo(newsItems).attr('href',url);
    current_class ='';

    slide.find('.feature_excerpt .sliderheading, .feature_excerpt .sliderdate').clone().appendTo(controll);
    controll.bind('click', {currentSlideNumber: i}, slideWrapper.methods.switchSlide);
        });

    controllWindowHeight = newsSelect.height();
    controllWindowPart = controllWindowHeight/3;
    itemWindowHeight = newsItems.height();

    if(slideCount > 1)
    {
      slideWrapper.kriesi_image_preloader({delay:200});
      slideWrapper.methods.preloadingDone();
    }
  },

  preloadingDone: function()
  {	
    skipSwitch = false;
    var offset = newsSelect.offset();

    newsSelect.mousemove(function(e)
        {
          mousePos = e.pageY - offset.top;

          if(!moving)
    {
      scrollInterval = setInterval(function() { slideWrapper.methods.scrollItem(mousePos); }, 25);
      moving = true;
    }
        }); 

    newsSelect.bind('mouseleave', function()
        { 
          clearInterval(scrollInterval); 
          moving = false;
          accelerator = 0;
        });

  },

  scrollItem: function()
  {	
    var movement = 0,
    percent = controllWindowPart / 100,
    modifier = 10,
    currentTop = parseInt(newsItems.css('top'));

    accelerator = accelerator <= 2 ? accelerator + 0.5 : accelerator; 

    if(mousePos < controllWindowPart)
    {	
      movement = ((controllWindowPart - mousePos) / percent) * accelerator;
      newPos = currentTop + (movement/modifier);

      if(currentTop < 0)
      {	
        if (newPos > 0) newPos = 0;
        newsItems.css({top:newPos + "px"});
      }
    }
    else if(mousePos > controllWindowPart * 2)
    {	
      movement = ((mousePos - controllWindowPart * 2) / percent) * accelerator;
      newPos = currentTop + (movement/modifier * -1);

      if((currentTop * -1) < itemWindowHeight - controllWindowHeight)
      {
        if (newPos * -1 > itemWindowHeight - controllWindowHeight) newPos = controllWindowHeight - itemWindowHeight;

        newsItems.css({top:newPos + "px"});
      }
    }
    else
    {
      accelerator = 0;
    }
  },

  switchSlide: function(passed)
  {	

    var noAction = false;

    if(passed != undefined && !skipSwitch)
    {
      if(currentSlideNumber != passed.data.currentSlideNumber)
      {	
        currentSlideNumber = passed.data.currentSlideNumber;
      }
      else
      {
        noAction = true;
      }
    }

    if(passed != undefined)
    {	
      // clearInterval(interval);
    }


    if(!skipSwitch && noAction == false)
    {	
      skipSwitch = true;
      var currentSlide = slides.filter(':visible'),
          nextSlide = slides.filter(':eq('+currentSlideNumber+')');

              newsSelect.find('.active_item').removeClass('active_item');
              newsSelect.find('a:eq('+currentSlideNumber+')').addClass('active_item');	

                currentSlide.css({zIndex:4});
                nextSlide.css({zIndex:2, display:'block'});

                currentSlide.fadeOut(options.animationSpeed, function()
                  {
                    currentSlide.css({zIndex:0, display:"none"});
                    skipSwitch = false;
                  });
                }
                return false;
                },

                autorotate: function()
                {	
                  //autorotation not yet supportet
                }

                };

slideWrapper.methods.init();
  });

}
})(jQuery);


// -------------------------------------------------------------------------------------------
// The Main accordion slider - KRICORDION

// Dependencies: equalheight function, kriesi_image_preoloader. jquery easing
//
// -------------------------------------------------------------------------------------------
(function($)
 {
   $.fn.kricordion = function(options) 
{
  var defaults = 
{
  slides: '>div',				// wich element inside the container should serve as slide
  animationSpeed: 900,		// animation duration
  autorotation: true,			// autorotation true or false?
  autorotationSpeed:3,		// duration between autorotation switch in Seconds
  easing: 'easeOutQuint',		// animation easing, more options at the bottom of this file
  event: 'mouseover',			// event to focus a slide: mouseover or click
  imageShadow:true,			// should the image get a drop shadow to the left
  imageShadowStrength:0.5,	// how dark should that shadow be, recommended values: between 0.3 and 0.8, allowed between 0 and 1
  fontOpacity: 1,				// opacity for font, if set to 1 it will be stronger but most browsers got a small rendering glitch at 1
  backgroundOpacity:0.8		// opacity for background

};

// merge default values with the values that were passed with the function call
var options = $.extend(defaults, options);

return this.each(function()
    {	
      // save some jQuery selections into variables, also calculate base values for each slide
      var slideWrapper 	= $(this),								// element that holds the slides
       slides			= slideWrapper.find(options.slides).css('display','block'),	// the slides
       slide_count 	= slides.length,						// number of slides
       slide_width		= slideWrapper.width() / slide_count	// width of the slides
  expand_slide 	= slides.width(),						// size of a slide when expanded, defined in css, class ".featured" by default
       minimized_slide	= (slideWrapper.width() - expand_slide) / (slide_count - 1), // remaining width is shared among the non-active slides
       overlay_modifier = 200 *(1- options.imageShadowStrength),					//increases the size of the minimized image div to avoid flickering
       excerptWrapper = slideWrapper.find('.feature_excerpt'),
       interval = '',
       current_slide = 0;


//modify excerptWrapper and re-select it, also add positioning span -------------------------
excerptWrapper.wrap('<span class="feature_excerpt"></span>').removeClass('feature_excerpt').addClass('position_excerpt');
excerptWrapper = slideWrapper.find('.feature_excerpt').css('opacity',options.backgroundOpacity);
// -------------------------------------------------------------------------------------------


//equal heights for all excerpt containers, then hide basic excerpt content -----------------
excerptWrapper.equalHeights().find('.position_excerpt').css({display:'block', opacity:0, position:'absolute'});
var excerptWrapperHeight = excerptWrapper.height();
// -------------------------------------------------------------------------------------------



//iterate each slide and set new base values, also set positions for acitve and inactive states and event handlers
slides.each(function(i)
    {
      var this_slide = $(this),											// current slide element
  this_slide_a = this_slide.find('a'),							// a tag inside the element
  real_excerpt = this_slide.find('.position_excerpt'),			// wrapper to center the excerpt content verticaly
  real_excerpt_height = real_excerpt.height(),					// height of the excerpt content
  slide_heading =this_slide.find('.sliderheading'),  				// slide heading
  cloned_heading =   slide_heading.clone().appendTo(this_slide_a) // clone heading for heading only view
  .addClass('heading_clone')
  .css({opacity:options.fontOpacity, width:slide_width-30}),
  clone_height = cloned_heading.height();							// height of clone heading, needed to center verticaly as well


this_slide.css('backgroundPosition',parseInt(slide_width/2-8) + 'px ' + parseInt((this_slide.height()- real_excerpt_height)/2 -8) + 'px');						

cloned_heading.css({bottom: (excerptWrapperHeight-clone_height)/2 +9});			//center clone heading
real_excerpt.css({bottom: (excerptWrapperHeight-real_excerpt_height)/2 +9});	//center real excerpt

this_slide.data( //save data of each slide via jquerys data method
  'data',
  {
    this_slides_position: i * slide_width,							// position if no item is active
  pos_active_higher: i * minimized_slide,							// position of the item if a higher item is active
  pos_active_lower: ((i-1) * minimized_slide) + expand_slide		// position of the item if a lower item is active
  });

//set base properties	
this_slide.css({zIndex:i+1, left: i * slide_width, width:slide_width + overlay_modifier});


//apply the fading div if option is set to do so
if(options.imageShadow)
{
  this_slide.find('>a').prepend('<span class="fadeout ie6fix"></span>');
}

});

// calls the preloader, kriesi_image_preloader plugin needed
jQuery('#featured').kriesi_image_preloader({callback:add_functionality});

function add_functionality()
{

  //set autorotation ---------------------------------------------------------------------------


  if(options.autorotation)
  {
    interval = setInterval(function() { autorotation(); }, (parseInt(options.autorotationSpeed) * 1000));
  }

  slides.each(function(i)
      {	
        var this_slide = $(this), 
    real_excerpt = this_slide.find('.position_excerpt'), 
    cloned_heading = this_slide.find('.heading_clone');

  //set mouseover or click event
  this_slide.bind(options.event, function(event, continue_autoslide)
    {	
      //stop autoslide on userinteraction
      if(!continue_autoslide)
  {
    clearInterval(interval)
  }

  var objData = this_slide.data( 'data' );
  //on mouseover expand current slide to full size and fadeIn real content
  real_excerpt.stop().animate({opacity:options.fontOpacity},options.animationSpeed, options.easing);
  cloned_heading.stop().animate({opacity:0},options.animationSpeed, options.easing);

  this_slide.stop().animate({	width: expand_slide + (overlay_modifier * 1.2), 
    left: objData.pos_active_higher},
    options.animationSpeed, options.easing);

  //set and all other slides to small size
  slides.each(function(j){

    if (i !== j)
  {	
    var this_slide = $(this),
    real_excerpt = this_slide.find('.position_excerpt'),
    cloned_heading = this_slide.find('.heading_clone'),
    objData = this_slide.data( 'data' ),
    new_pos = objData.pos_active_higher;

  if(i < j) { new_pos = objData.pos_active_lower; }
  this_slide.stop().animate({left: new_pos, width:minimized_slide + overlay_modifier},options.animationSpeed, options.easing);
  real_excerpt.stop().animate({opacity:0},options.animationSpeed, options.easing);
  cloned_heading.stop().animate({opacity:options.fontOpacity},options.animationSpeed, options.easing);
  }

  });

    });
      });


  //set mouseout event: expand all slides to no-slide-active position and width
  slideWrapper.bind('mouseleave', function()
      {
        slides.each(function(i)
          {
            var this_slide = $(this),
          real_excerpt = this_slide.find('.position_excerpt'),
          cloned_heading = this_slide.find('.heading_clone'),
          objData = this_slide.data( 'data' ),
          new_pos = objData.this_slides_position;

        this_slide.stop().animate({left: new_pos, width:slide_width + overlay_modifier},options.animationSpeed, options.easing);
        real_excerpt.stop().animate({opacity:0},options.animationSpeed, options.easing);
        cloned_heading.stop().animate({opacity:options.fontOpacity},options.animationSpeed, options.easing);
          });

      });
}


// autorotation function for the image slider
function autorotation()
{	
  if(slide_count  == current_slide)
  {
    slideWrapper.trigger('mouseleave');
    current_slide = 0;
  }
  else
  {
    slides.filter(':eq('+current_slide+')').trigger(options.event,[true]);
        current_slide ++;
        }
        }
        });
};
})(jQuery);
// -------------------------------------------------------------------------------------------
// END KRICORDION
// -------------------------------------------------------------------------------------------



function k_menu()
{
  // k_menu controlls the dropdown menus and improves them with javascript

  jQuery(".nav a, .catnav a").removeAttr('title');
  jQuery(" .nav ul, .catnav ul ").css({display: "none"}); // Opera Fix


  // remove the last border from category menu item if there are 7 items, that border is not needed
  if(jQuery(".catnav>li").length >= 7)
  {
    jQuery(".catnav>li:last").addClass('noborder');
  }


  //set equal height for all category main items, in case a description is too long
  var mainitem = jQuery(".catnav>li>a");
  mainitem.each(function()
      {
        if(jQuery(this).height() < 34)
  {
    jQuery(this).css({height:"34px"});
  }
      });
  mainitem.equalHeights();



  //smooth drop downs
  jQuery(".nav li, .catnav li").each(function()
      {	

        var $sublist = jQuery(this).find('ul:first');

        jQuery(this).hover(function()
          {	
            $sublist.stop().css({overflow:"hidden", height:"auto", display:"none"}).slideDown(400, function()
              {
                jQuery(this).css({overflow:"visible", height:"auto"});
              });	
          },
          function()
          {	
            $sublist.stop().slideUp(400, function()
              {	
                jQuery(this).css({overflow:"hidden", display:"none"});
              });
          });	
      });
}


//equalHeights by james padolsey
jQuery.fn.equalHeights = function() {
  return this.height(Math.max.apply(null,
        this.map(function() {
          return jQuery(this).height()
        }).get()
        ));
};


function k_pixelperfect()
{	
  // sometimes some elements are offset by one or two pixels. 
  // this isnt anything bad but i really like pixel perfection, therefore this function adds some css rules for specific browsers :)
  if((jQuery.browser.msie && jQuery.browser.version < 7 ) || jQuery.browser.opera)
  {	
    jQuery('#headextras #searchsubmit').css({top:"10px"});
  }

  //same size for sidebars:
  jQuery('.sidebar').equalHeights();
}



function my_lightbox($elements)
{	
  var usedCSS = 1;
  jQuery('link').each(function()
      {	
        styleURL = jQuery(this).attr('href'); 
        CSSnumber = styleURL.match(/style(\d).css/);
        if(CSSnumber && CSSnumber.length > 0)
  {
    usedCSS = CSSnumber[1];
  }
      });


  var theme_selected = 'light_rounded';
  if (usedCSS == 2 || usedCSS == 4)
  {
    theme_selected = 'dark_rounded';
  }

  jQuery($elements).prettyPhoto({
    "theme": theme_selected /* light_rounded / dark_rounded / light_square / dark_square */																	});

  jQuery($elements).each(function()
      {	
        var $image = jQuery(this).contents("img");
        $newclass = 'lightbox_video';

        if(jQuery(this).attr('href').match(/(jpg|gif|jpeg|png|tif)/)) $newclass = 'lightbox_image';

        if ($image.length > 0)
  {	
    if(jQuery.browser.msie &&  jQuery.browser.version < 7) jQuery(this).addClass('ie6_lightbox');

    var $bg = jQuery("<span class='"+$newclass+" ie6fix'></span>").appendTo(jQuery(this));

    jQuery(this).bind('mouseenter', function()
      {
        $height = $image.height();
        $width = $image.width();
        $pos =  $image.position();		
        $bg.css({height:$height, width:$width, top:$pos.top, left:$pos.left});
      });
  }
      });	

  jQuery($elements).contents("img").hover(function()
      {
        jQuery(this).stop().animate({opacity:0.5},400);
      },
      function()
      {
        jQuery(this).stop().animate({opacity:1},400);
      });
}


(function($)
 {
   $.fn.kriesi_ajax_form = function(options) 
{
  var defaults = 
{
  sendPath: 'send.php',
responseContainer: '.ajaxresponse'
};

var options = $.extend(defaults, options);

return this.each(function()
  {
    var form = $(this),
       send = 
{
  formElements: form.find('textarea, select, input:text, input[type=hidden]'),
       validationError:false,
       button : form.find('input:submit'),
       datastring : ''
};

send.button.bind('click', checkElements);

function send_ajax_form()
{
  send.button.fadeOut(300);	

  $.ajax({
    type: "POST",
    url: options.sendPath,
    data:send.datastring,
    success: function(response)
  {	

    var message =  $("<div'></div>").addClass(options.responseContainer)
    .css('display','none')
    .insertBefore(form)
    .html(response); 

  form.slideUp(400, function(){message.slideDown(400), send.formElements.val('');});

  }
  });

}

function checkElements()
{	
  // reset validation var and send data
  send.validationError = false;
  send.datastring = 'ajax=true';

  send.formElements.each(function(i)
      {
        var currentElement = $(this),
    surroundingElement = currentElement.parent(),
    value = currentElement.val(),
    name = currentElement.attr('name'),
    classes = currentElement.attr('class'),
    nomatch = true;

  send.datastring  += "&" + name + "=" + value;

  if(classes.match(/is_empty/))
  {
    if(value == '')
  {
    surroundingElement.attr("class","").addClass("error");
    send.validationError = true;
  }
    else
  {
    surroundingElement.attr("class","").addClass("valid");
  }
    nomatch = false;
  }

  if(classes.match(/is_email/))
  {
    if(!value.match(/^\w[\w|\.|\-]+@\w[\w|\.|\-]+\.[a-zA-Z]{2,4}$/))
    {
      surroundingElement.attr("class","").addClass("error");
      send.validationError = true;
    }
    else
    {
      surroundingElement.attr("class","").addClass("valid");
    }	
    nomatch = false;
  }

  if(nomatch && value != '')
  {
    surroundingElement.attr("class","").addClass("valid");
  }
      });

  if(send.validationError == false)
  {
    send_ajax_form();
  }
  return false;
}
});
}
})(jQuery);






/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
    {
      def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert(jQuery.easing.default);
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c*(t/=d)*t*t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t*t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158; 
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
    return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
  }
    });

21
