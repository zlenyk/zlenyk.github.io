$(document).ready(function(){
    $('.menu > li').bind('mouseover',openSubMenu);
    $('.menu > li').bind('mouseout',closeSubMenu);

    function openSubMenu(){
        $(this).find('ul').css('visibility','visible');
    };
    function closeSubMenu(){
        $(this).find('ul').css('visibility','hidden');
    };
});
