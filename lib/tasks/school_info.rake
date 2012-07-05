desc "Buscar informacion de los colegios"

task :get_school_info => :environment do

  require 'nokogiri'
  require 'open-uri'

  count =0
  count2 = 0
  while (count < 156)   
    count = count +1
    url = "http://www.pac.com.ve/index.php?option=com_jumi&fileid=9&Itemid=119&keyword=Colegio&ubicacion=&filtro=%3Bheaddesc%3A%40COM@Colegios%2C+Escuelas%2C%20Liceos%20E%20Institutos@COM@&pagina=#{count}&orden="
    doc = Nokogiri::HTML(open(url))
    doc.css(".aviso").each do |item|
      count2 = count2 + 1
      school = School.new 
      nombre = item.at_css(".h3, a").text
      puts count2
      puts nombre + nombre.encoding.to_s
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
            email2 = email[2..100]
            school.email = email2

          end
        end
      end
      puts "Pagina numero" + count.to_s
      school.name = nombre
      school.city = ciudad
      school.state = estado
      school.address = direccion
      school.phone = telefono
      school.save
    end

  end



end