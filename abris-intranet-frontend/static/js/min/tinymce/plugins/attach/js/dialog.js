tinyMCEPopup.requireLangPack();
 
var MicsDialog = {
 
   // Инициализируем наш плагин
   init : function() {
 
      // Получаем экземплян формы в диалоге
      var f = document.forms[0];
 
      // устанавливаем начальные значения
      f.mtext.value = '';   // Значение имени файла
      f.mhref.value = '';   // Ссылка на файл
 
      val = document.forms[0].mhref.value;
      document.forms[0].mtext.value = val.substring(val.lastIndexOf('/')+1,val.length);

      document.getElementById('srcbrowsercontainer').innerHTML = getBrowserHTML('srcbrowser','mhref','micslink');
      if (isVisible('srcbrowser'))
         document.getElementById('mhref').style.width = '260px';
 
   getfile : function() {
   val = document.forms[0].mhref.value;
   document.forms[0].mtext.value = val.substring(val.lastIndexOf('/')+1);
 
   },
 
   // Функция обработки и вставки ссылки
   insert : function() {
      // настроим нашу ссылку заменим все пробелы и заодно узнаем тип файла
      var hfile = document.forms[0].mhref.value.replace(/s/g,"%20");
      var subhfile = hfile.substring(hfile.lastIndexOf(".")+1);
 
      var tfile = document.forms[0].mtext.value;
      tfile = tfile.replace(/s/g," ");
      var nameclass = '';
 
      // Проверим какого же типа наш документ
      switch (subhfile) {
 
         // архивы file_zip.ico
           case "rar":
         case "zip":
         case "tar":
         case "7z":
             nameclass = 'filezip';
             break;
 
         // Таблицы file_xls.ico
         case "xls":
         case "xlsx":
         case "ods":
         case "ots":
             nameclass = 'filexls';
             break;
 
         // Текстовые файлы file_txt.ico
         case "txt":
         case "cpp":
         case "xml":
         case "html":
         case "htm":
         case "php":
         case "js":
         case "css":
         case "c":
         case "h":
         case "vp":
         case "cs":
            nameclass = 'filetxt';
            break;
 
         // PDF файлы file_pdf.ico
         case "pdf":
            nameclass = 'filepdf';
            break;
 
         // Презентации file_ppt.ico
         case "ppt":
         case "pptx":
         case "odp":
         case "otp":
             nameclass = 'fileppt';
             break;      
 
         // документы file_doc.ico
         case "doc":
         case "docx":
         case "rtf":
         case "odt":
         case "ott":
             nameclass = 'filedoc';
             break;
 
         // торрент file_torrent.ico
         case "torrent":
            nameclass = 'filetorrent';
            break;
 
         // Изображения file_img.ico
         case "jpg":
         case "bmp":
         case "ico":
         case "png":
         case "gif":
            nameclass = 'fileimg';
            break;
 
         // другие файлы file_other.ico
           default:
             nameclass = 'filother';
            break;
      }
 
      // Скомпонуем все детали в единое целое
      mlink= " ";
      mlink+= "[ Файл:  + nameclass + "" href="";
      mlink+= hfile + ">" + tfile + " ] ";
 
      // отправим нашу свежесозданую ссылку в документ
      tinyMCEPopup.editor.execCommand('mceInsertContent', false, mlink);
 
      tinyMCEPopup.close();
    }
 
};
 
tinyMCEPopup.onInit.add(MicsDialog.init, MicsDialog);