class SchoolType < ActiveRecord::Base
  belongs_to :school
  belongs_to :school_groups
end