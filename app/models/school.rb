class School < ActiveRecord::Base
  attr_accessible :city, :email, :name, :phone, :state, :note, :address, :school_system_id, :school_group_ids
  
  
  belongs_to :school_system
  has_many :school_groups, :through => :school_types
  has_many :school_types
  
end
