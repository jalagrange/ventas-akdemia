class SchoolGroup < ActiveRecord::Base
  attr_accessible :name
  
  has_many :schools, :through => :school_type
  has_many :school_types
end
