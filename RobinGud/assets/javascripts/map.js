// ymaps.ready(function () {
//     var myMap = new ymaps.Map('map', {
//             center: [55.749259, 37.563268],
//             zoom: 9
//         }, {
//             searchControlProvider: 'yandex#search'
//         }),

//         // Создаём макет содержимого.
//         MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
//             '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
//         ),

//         myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
//             hintContent: 'Собственный значок метки',
//             balloonContent: 'Это красивая метка'
//         }, {
//             // Опции.
//             // Необходимо указать данный тип макета.
//             iconLayout: 'default#image',
//             // Своё изображение иконки метки.
//             iconImageHref: '/assets/images/label-map.png',
//             // Размеры метки.
//             iconImageSize: [171, 55],
//             // Смещение левого верхнего угла иконки относительно
//             // её "ножки" (точки привязки).
//             iconImageOffset: [-5, -38]
//         }),

//     myMap.geoObjects.add(myPlacemark)
// });

// Создает обработчик события window.onLoad
YMaps.jQuery(function () {
    // Создает экземпляр карты и привязывает его к созданному контейнеру
    var map = new YMaps.Map(YMaps.jQuery("#map")[0]);
        
    // Устанавливает начальные параметры отображения карты: центр карты и коэффициент масштабирования
    map.setCenter(new YMaps.GeoPoint(37.563268, 55.749259), 17);

    // Создает стиль
    var s = new YMaps.Style();

    // Создает стиль значка метки
    s.iconStyle = new YMaps.IconStyle();
    // s.iconStyle.href = "http://localhost:7879/markup/assets/images/label-map.png";
    s.iconStyle.href = "http://rg17.5agency.ru/theme/assets/images/label-map.png";
    s.iconStyle.size = new YMaps.Point(171, 55);
    s.iconStyle.offset = new YMaps.Point(-85, -55);

    // Создает метку
    var placemark = new YMaps.Placemark(new YMaps.GeoPoint(37.563268, 55.749259), {style: s});

    // Устанавливает содержимое балуна
    placemark.name = "РобинГуд";
    placemark.description = "Москва, Кутузовский проспект, дом 7, офис 500.";

    // Добавляет метку на карту
    map.addOverlay(placemark); 
})