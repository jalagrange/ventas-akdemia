class Principal < ActiveRecord::Base
  attr_accessible :email, :name, :phone
  
  belongs_to :school
  
end
