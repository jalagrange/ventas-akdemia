require 'rubygems'
require 'nokogiri'
require 'open-uri'

count =0
while (count < 1) 
  count = count +1
  url = "http://www.pac.com.ve/index.php?option=com_jumi&fileid=9&Itemid=119&keyword=Colegio&ubicacion=&filtro=%3Bheaddesc%3A%40COM@Colegios%2C+Escuelas%2C%20Liceos%20E%20Institutos@COM@&pagina=#{count}&orden="
  doc = Nokogiri::HTML(open(url))
  doc.css(".aviso").each do |item|
    nombre = item.at_css(".h3, a").text
    ciudad_estado = item.at_css("b").text
    ciudad = ciudad_estado.match("(.+(?=,))").to_s
    estado = ciudad_estado.match("(,.+)").to_s
    estado = estado.to_s.sub!(/,/, "").strip.to_s
    direccion = item.at_css(".direccion").text
    telefono = item.at_css(".telaviso").text
    link_colegio = item.at_css(".h3, a")[:href]
    unless link_colegio.match("http.+")
      url2 = "http://www.pac.com.ve" + link_colegio
      doc2 = Nokogiri::HTML(open(url2))
      doc2.css(".holder_content_inside").each do |colegio|
        unless doc2.at_css(".holder_content_section div:nth-child(1) a").nil?
          email = doc2.at_css(".holder_content_section div:nth-child(1) a").to_s.match("(>.+<)").to_s.sub!(/>/,"").sub!(/</,"")
          puts email.encoding
          email2 = email.gsub("\302\240", ' ').strip
          puts email2.encoding
        end
      end
    end
    puts "Pagina numero" + count.to_s
    puts nombre.encoding
    puts ciudad.to_s.encoding
    puts estado.encoding
    puts direccion.encoding
    puts telefono.encoding

  end

end
