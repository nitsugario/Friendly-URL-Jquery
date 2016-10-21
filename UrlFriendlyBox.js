/*
* library for making friendly URLs by stripping out  lating chars.
*
* Copyright (c) 2016
* Author: Agustin Rios Reyes.
* Email:  nitsugario@gmail.com
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
*
*/
(function($)
{
	$.fn.UrlFriendlyBox = function (method)
	{
		var defaults =
		{
			lstDomain: 'http://nitsugario.com',
			lstLabelCheck: 'Remove Stop Words:',
			lstSeparator: "-",
			lstAppend: '',
			lnuMaxlength: 60,
			lboDomain: false,
			lboAppend: false,
			lboStopWords: false,
			lboSelectStopWords: false,
			laySpecialCharacters: { ą:"a",Ą:"A",ę:"e",Ę:"E",ó:"o",Ó:"O",ś:"s",Ś:"S",ł:"l",Ł:"L",
									ż:"z",Ż:"Z",ź:"z",Ź:"Z",ć:"c",Ć:"C",ń:"n",Ń:"N",č:"c",ď:"d",
									ň:"n",ř:"r",š:"s",ť:"t",Š:"S",Œ:"O",Ž:"Z",š:"s",œ:"o",ž:"z",
									Ÿ:"Y",ÿ:"y",µ:"U",À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Æ:"A",
									Ç:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ð:"D",
									Ñ:"N",Ò:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",
									Ý:"Y",ß:"s",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",æ:"a",ç:"c",
									è:"e",é:"e",ê:"e",ë:"e",ì:"i",í:"i",î:"i",ï:"i",ð:"o",ñ:"n",
									ò:"o",ô:"o",õ:"o",ö:"o",ø:"o",ù:"u",ú:"u",û:"u",ü:"u",ý:"y",
									'¥':"Y",'&':"and"},
			layStopWords: [ //|---------------------------Artículos------------| 
							"el","la","los","las","un","una","uno","unas","unos",
							//|---------------------------preposiciones--------|
							"a","de","ante","bajo","cabe","con","contra","desde","durante","en","entre","hacia","hasta","mediante","para","por","según","sin","so","sobre","tras","versus","via",
							//|---------------------------pronombres---------------------------|
							"yo","me","mi","nos","nosotros","nosotras","conmigo","te","ti","tu","os","ustedes","vos","vosotras","vosotros","contigo","ella","ellas","ellos","ello","lo","les","se","si",
							"aquellas","aquella","aquellos","aquel","esas","esa","esos","ese","esotra","esotro","esta","estas","estos","este","estotro","estotra","mia","mias","mio","mios","nuestra","nuestras",
							"nuestro","nuestros","suya","suyas","suyo","suyos","tuya","tuyas","tuyo","tuyos","vuestra","vuestras","vuestros","vuestro","algo","alguien","alguna","algunas","alguno","algunos","cualesquiera",
							"cualquiera","demas","mismas","misma","mismo","mismos","muchas","mucha","mucho","muchos","nada","nadie","ninguna","ningunas","ninguno","ningunos","otra","otro","otras","otros","poca","pocas","poco",
							"pocos","quienquier","quienesquiera","quienquiera","tanta","tantas","tanto","tantos","toda","todas","todo","todos","ultima","ultimas","ultimo","ultimos","varios","varias","adonde","como","cual","cuales",
							"cuando","cuanta","cuantas","cuanto","cuantos","donde","que","quien","quienes","cuya","cuyas","cuyo","cuyos"]
		};

		var settings = {};

		var methods  =
		{
			init: function (options)
			{
				settings = $.extend({}, defaults, options);

				return this.each(function ()
				{
					var $gobURL = $(this); 

					if ( $gobURL.prop("tagName") == 'INPUT' && $gobURL.prop("type") == 'text' )
					{ 
						methods.setup.apply(this, Array.prototype.slice.call(arguments, 1));
					}
					else
					{
						$.error('El elemento '+$gobURL.prop("type")+' no es valido para UrlFriendlyBox :( ');
					};
				});
			},
			setup: function ()
			{
				var $lobWrapper,
					$lobInput      = $(this), 
					lobInput       = this,
					lstNombreI     = $lobInput.attr("id"),
					lstNombreCheck = lstNombreI+'_StopWords',
					lstLabelCheck  = settings.lstLabelCheck,
					lstNombreUrlFy = lstNombreI+'_UrlFriendly';

				$lobInput.wrap('<div id="wrapper_UrlF" class="urlfriendlybox"></div>');
				$lobInput.wrap('<div class="Fila"></div>');

				$lobWrapper   = $lobInput.closest('#wrapper_UrlF');

				if( settings.lboSelectStopWords )
					$lobWrapper.prepend('<div class="Fila"><label for="'+lstNombreCheck+'">'+lstLabelCheck+'</label><input type="checkbox" id="'+lstNombreCheck+'" value="" class="icheckbox"></div>');
				
				$lobWrapper.append('<div class="Fila"><input type="text" id="'+lstNombreUrlFy+'" value="" placeholder="URL Friendly"></div>');

				helpers._onUrlFriendlyBox($lobInput);

				return lobInput;
			}
		};

		var helpers = {
			_onUrlFriendlyBox: function( $pobInputUrl )
			{
				var $lobInput      = $pobInputUrl,
					lstNombreI     = $lobInput.attr("id"),
					lstNombreCheck = '#'+lstNombreI+'_StopWords',
					lstNombreUrlFy = '#'+lstNombreI+'_UrlFriendly';

				$lobInput.on("change",function()
				{
					if( settings.lboSelectStopWords )
					{
						if( $(lstNombreCheck).prop('checked') )
							settings.lboStopWords = true;
						else
							settings.lboStopWords = false;
					}

					var lstTextUrlFriendly = helpers._mstCreateUrlFriendly( $(this).val() );

					if( settings.lboDomain )
					{
						if ( settings.lstDomain != '' )
						{
							if ( settings.lstDomain.substr(-1) == '/')
								if( settings.lboAppend )
									$(lstNombreUrlFy).val(settings.lstDomain+lstTextUrlFriendly+settings.lstAppend);
								else
									$(lstNombreUrlFy).val(settings.lstDomain+lstTextUrlFriendly);
							else
								if( settings.lboAppend )
									$(lstNombreUrlFy).val(settings.lstDomain+'/'+lstTextUrlFriendly+settings.lstAppend);
								else
									$(lstNombreUrlFy).val(settings.lstDomain+'/'+lstTextUrlFriendly);
						}
						else
							$.error(' El Nombre del Dominio no está definido.');
					}
					else
					{
						if( settings.lboAppend )
							$(lstNombreUrlFy).val(lstTextUrlFriendly+settings.lstAppend);
						else
							$(lstNombreUrlFy).val(lstTextUrlFriendly);
					}
				});
			},
			_mstCreateUrlFriendly: function( pstTextUrl )
			{
				var lstTextUrl     = '',
					lstTextUrlTemp = '',
					layTextUrlTemp = [],
					lnuMaxlength   = settings.lnuMaxlength,
					lstSeparator   = settings.lstSeparator;

				lstTextUrl = helpers._mstChangeCharacters( pstTextUrl );

				if (settings.lboStopWords)
					lstTextUrl = helpers._mstRemoveStopWords( lstTextUrl );

				lstTextUrl = lstTextUrl.replace(/^\s+|\s+$/g, "") // Quitar espacios al inicio y final	
								.replace(/[_|\s]+/g, lstSeparator ) // Cambiar todos los espacios y guiones bajos por un guion medio.
								.replace(/[^a-zA-z\u0400-\u04FF0-9-%-]+/g, "") // Eliminar todos los demás caracteres menos los números, letras,% y - .
								.replace(/[-]+/g, lstSeparator ) // Remplazar más de dos guiones medios juntos.
								.replace(/^-+|-+$/g, "") // Eliminar guiones medios al inicio y al final.
								.replace(/[-]+/g, lstSeparator );	// Remplazar  guion con el divisor.

				if( lstTextUrl.length > lnuMaxlength)
				{
					lstTextUrlTemp = lstTextUrl.substring( 0, lnuMaxlength );
					layTextUrlTemp = lstTextUrlTemp.split( lstSeparator );
					layTextUrlTemp.pop();//eliminamos la ultima palabra.
					lstTextUrlTemp = layTextUrlTemp.join( lstSeparator );
				}
				else
					lstTextUrlTemp = lstTextUrl;

				return lstTextUrlTemp;
			},
			_mstChangeCharacters: function( pstTextUrl )
			{
				var layTextUrlTemp = [];

				for( var i = 0, j = pstTextUrl.length; i < j; i++ )
				{
					var c = pstTextUrl.charAt( i );

					if( settings.laySpecialCharacters.hasOwnProperty( pstTextUrl.charAt( i ) ) )
						layTextUrlTemp.push( settings.laySpecialCharacters[ c ] );
					else
						layTextUrlTemp.push( c );
				}

				return layTextUrlTemp.join( '' );
			},
			_mstRemoveStopWords: function( pstTextUrl )
			{
				var layWordsTextUrl = pstTextUrl.toLowerCase().split(' '),
					layTextUrlTemp  = [];

				for (var i = 0; i < layWordsTextUrl.length; i++)
				{
					if ( $.inArray(layWordsTextUrl[i],settings.layStopWords) == -1 )
						layTextUrlTemp.push(layWordsTextUrl[i]);
				}

				return layTextUrlTemp.join( ' ' );
			}
		};

		if (methods[method])
		{
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method)
		{
			return methods.init.apply(this, arguments);
		}
		else
		{
			$.error('El Método "' +  method + '" No existe en el plugin! :( ');
		}
	}
})(jQuery);