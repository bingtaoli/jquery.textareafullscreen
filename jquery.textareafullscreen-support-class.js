(function($) {
    "use strict";

    var isFullscreen = false,
        $el,
        $wrapper,
        $editor,
        $index = -1,
        $icon,
        $overlay,
        transitionDuration = 300,
        settings = {
            overlay: true,
            maxWidth: '',
            maxHeight: ''
        };
    var methods = {

        init: function(opts) {

            settings = settings || {};
            $.extend(true, settings, settings);
            $.extend(true, settings, opts);
            $index++;
            $el = $(this);
            var id = $(this).attr('id');
            console.log(id);
            var content =
                '<div class="tx-editor-wrapper"><div class="tx-editor" id="tx-editor'+ id + '"><a href="#" index="'+ $index + '" class="tx-icon" id="tx-icon' + id + '"></a></div></div>';
            var $wrapper = $(content).insertAfter(this);
            $editor = $editor || [];
            $editor.push($wrapper.find('#tx-editor'+ id));
            $icon = $editor[$index].find('#tx-icon' + id);
            $editor[$index].append($el);

            $el.css({
                'width': '100%',
                'height': '100%',
				'resize': 'none'
            });

            // ESC = closes the fullscreen mode
            $(window).on("keyup.txeditor", function(e) {
                if (e.keyCode == 27) {
                    isFullscreen ? methods.minimize() : '';
                }
            });

            // fullscreen icon click event
            $icon.on('click.txeditor.icon', function(e) {
                console.log(this);
                var index = $(this).attr('index');
                e.preventDefault();
                methods[isFullscreen ? "minimize" : "expand"](index);
            });
            return this;
        },

        showOverlay: function() {
            $('<div class="tx-editor-overlay" />').appendTo('body')
                .fadeTo(0, 1)
                .click(function() {
                    methods.minimize();
                });
            return this;
        },

        removeOverlay: function() {
            var $overlay = $('.tx-editor-overlay');
            if ($overlay.length) {
                $overlay.fadeTo(0, 0, function() {
                    $(this).remove();
                });
            }
            return this;
        },

        expand: function(i) {
            settings.maxWidth ? $editor.css('max-width', settings.maxWidth) :
                '';
            settings.maxHeight ? $editor.css('max-height', settings.maxHeight) :
                '';
            if (settings.overlay) {
                methods.showOverlay();
            }

            $(window).on('resize.txeditor', function() {
                relocate($editor);
            });

            $editor[i].addClass('expanded');
            transitions(i);

            return this;
        },

        minimize: function(i) {

            $(window).off('resize.txeditor', relocate($editor[i]))
            $editor[i].removeClass('expanded')
                .css({
                    'max-width': 'none',
                    'max-height': 'none'
                });
            if (settings.overlay) {
                methods.removeOverlay();
            }
            transitions(i);

            return this;
        },

        destroy: function() {

            methods.removeOverlay();
            $wrapper.insertBefore($el);
            $wrapper.remove();

            $(window).off('keyup.txeditor')
                .off('resize.txeditor');

            return this;
        },
    };

    var transitions = function (i) {
			relocate($editor[i]);
            if (isFullscreen) {
				$el.focus();
				isFullscreen = false;
            } else {
				$el.focus();
				$editor[i].css('opacity', 1);
				isFullscreen = true;
            }

            return;
    };

    function relocate(el) {

        var yPos = 0 | ((($(window).height() - el.height()) / 2));
        var xPos = 0 | (($(window).width() - el.width()) / 2);
        el.css({
            'top': yPos,
            'left': xPos
        });

    }

    $.fn.textareafullscreen = function(method) {
        $.extend(methods, transitions);
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(
                arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method +
                ' does not exist on jQuery.textareafullscreen');
        }
    };

})(jQuery);
