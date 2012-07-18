class School < ActiveRecord::Base
  attr_accessible :city, :email, :name, :phone, :state, :note, :address, :school_system_id, :school_group_ids, :number_of_students
  attr_accessible :is_public, :tuition, :guardian_attributes, :principal_attributes, :contact_status_id
  
  
  belongs_to :school_system
  belongs_to :contact_status
  has_one :principal
  has_one :guardian
  has_many :school_groups, :through => :school_types
  has_many :school_types
  
  accepts_nested_attributes_for :principal, :guardian
  
  validates_presence_of :contact_status_id, :city, :email, :name, :phone, :state, :school_system_id, :number_of_students
  validates_inclusion_of :is_public, :in=> [true,false]
  
  def previous
    School.find_by_id(self.id - 1)
  end
  
  def next
    School.find_by_id(self.id + 1)
  end
  
end
