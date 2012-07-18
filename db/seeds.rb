# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

SchoolSystem.create :name   => 'EduDatos'
SchoolSystem.create :name   => 'EduWeb'
SchoolSystem.create :name   => 'MiColegio.com.ve'
SchoolSystem.create :name   => 'Colegium'
SchoolSystem.create :name   => 'Control-E'
SchoolSystem.create :name   => 'Aldea Educativa'
SchoolSystem.create :name   => 'Otro'
SchoolSystem.create :name   => 'Ninguno'

SchoolGroup.create :name   => 'Preescolar'
SchoolGroup.create :name   => 'Básica'
SchoolGroup.create :name   => 'Bachillerato'
SchoolGroup.create :name   => 'Universitario'
SchoolGroup.create :name   => 'Técnica'

ContactStatus.create :name   => 'Contactado'
ContactStatus.create :name   => 'Llamar luego'
ContactStatus.create :name   => 'Teléfojno dañado'
ContactStatus.create :name   => 'Sin cooperación'
ContactStatus.create :name   => 'Otro (agragar nota)'