class AddFieldstoSchools < ActiveRecord::Migration
  def change
    add_column :schools, :tuition, :float
    add_column :schools, :is_public, :bool
  end
end
