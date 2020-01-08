require([
  'jquery',
  'util',
  'registerSW',
  'fancybox',
  'confirm',
  // 'share',
  'search'
], function($, util) {
  'use strict'

  // 阻止冒泡
  function stopPropagation(e) {
    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true)
  }

  // bind events
  $(document).ready(function() {
    // 图片预览
    $('[data-fancybox="images"]').fancybox({ loop: true })

    // 侧边菜单
    $(document).on('click', '.toggle-icon', function() {
      $('#side').hasClass('active') ? $('#side').removeClass('active') : $('#side').addClass('active')
    })

    // phone menu
    $(document).on('click', '.menu-icon', function() {
      $('#menu-mask')
        .removeClass('hide')
        .toggleClass('showMenuMask')
        .toggleClass('hideMenuMask')
      $('body').toggleClass('overflow')
    })

    $(document).on('click', '#menu-mask .icon-close', function() {
      $('#menu-mask')
        .removeClass('hide')
        .toggleClass('showMenuMask')
        .toggleClass('hideMenuMask')
      $('body').toggleClass('overflow')
    })

    // fixed-menu
    $(document).on('click', '#fixed-menu', function() {
      $('#fixed-menu-wrap > span').toggleClass('menu-reset')
    })

    $('h1,h2,h3,h4,h5,h6').hover(
      function() {
        $(this)
          .find('.post-anchor')
          .text('#')
      },
      function() {
        $(this)
          .find('.post-anchor')
          .text('')
      }
    )

    // post-toc
    $(document).on('click', '.icon-toc', function() {
      $('#post-toc')
        .removeClass('hide')
        .toggleClass('showToc')
        .toggleClass('hiddenToc')
    })

    // search
    $(document).on('click', '.search-box', function() {
      $('#search-shade')
        .removeClass('hide')
        .toggleClass('showSearch')
        .toggleClass('hiddenSearch')
      $('body').toggleClass('overflow')
      $('#fixed-menu-wrap > span').addClass('menu-reset')
    })

    $(document).on('click', '#search-shade .icon-close', function() {
      $('#search-shade')
        .toggleClass('showSearch')
        .toggleClass('hiddenSearch')
      $('body').toggleClass('overflow')
    })

    // 分享
    $(document).on('click', '.share', function(e) {
      var that = $(this)
      // $().share({
      //   url: `${location.origin}${that.data('url')}` || location.href,
      //   sites: HUHU_CONFIG.share
      // })
      stopPropagation(e)
    })

    // 咖啡
    $(document).on('click', '#reward-button', function() {
      $('#qr').toggle('1000')
    })

    // 顶部滚动进度条
    $(window).scroll(function() {
      var pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight // 页面总高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight // 浏览器视口高度
      var scrollAvail = pageHeight - windowHeight // 可滚动的高度
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动条的高度
      var ratio = (scrollTop / scrollAvail) * 100 + '%'
      $('#progress > .line').css('width', ratio)
    })

    var mousewheel = function(e) {
      e = e || window.event

      // 判断浏览器IE，谷歌滑轮事件
      if (e.wheelDelta) {
        // 当滑轮向上滚动时
        if (e.wheelDelta > 0) {
          $('#side').removeClass('active')
        }

        // 当滑轮向下滚动时
        if (e.wheelDelta < 0) {
          $('#side').addClass('active')
        }
      }
      // Firefox滑轮事件
      else if (e.detail) {
        // 当滑轮向上滚动时
        if (e.detail > 0) {
          $('#side').removeClass('active')
        }

        // 当滑轮向下滚动时
        if (e.detail < 0) {
          $('#side').addClass('active')
        }
      }
    }

    document.addEventListener && document.addEventListener('DOMMouseScroll', mousewheel, false) // firefox
    window.onmousewheel = document.onmousewheel = mousewheel // 滚动滑轮触发scrollFunc方法 ie 谷歌

    // fiexed menu
    $(document).on('click', '.icon-arrowup', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      $('#fixed-menu-wrap > span').addClass('menu-reset')
    })

    function handleDisplay() {
      $(this)
        .addClass('active')
        .siblings()
        .removeClass('active')
      var cate = $(this)
        .attr('class')
        .split(' ')[0]
      $('.post-wrap > .post').each(function() {
        if ($(this).hasClass(cate)) {
          $(this).addClass('active')
        } else {
          $(this).removeClass('active')
        }
      })
    }

    // 分类、标签页
    $(document).on('click', '#categories > .list > li', handleDisplay)
    $(document).on('click', '#tags > .list > li', handleDisplay)

    // pjax
    if ($.support.pjax) {
      $(document).on('click', 'a[data-pjax]', function(event) {
        var container = $(this).closest('[data-pjax-container]')
        var containerSelector = '#' + container.id
        $.pjax.click(event, { container: containerSelector })
      })
    }


  })
})
