class AddFieldstoSchools < ActiveRecord::Migration
  def change
    add_column :schools, :tuition, :float
    add_column :schools, :public, :bool
  end
end
