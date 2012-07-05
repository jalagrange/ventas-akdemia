class School < ActiveRecord::Base
  attr_accessible :city, :email, :name, :phone, :state, :note, :address, :school_system_id
  
  has_one :school_system
  has_many :school_groups, :through => :school_type
  has_many :school_types
  
end
