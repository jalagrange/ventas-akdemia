class AddSchoolSystemIdtoSchools < ActiveRecord::Migration
  def up
    add_column :schools, :school_system_id, :integer
  end

  def down
    remove_column :schools, :school_system_id
  end
end
