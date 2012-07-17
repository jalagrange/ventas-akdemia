class AddContactStatusIdToSchools < ActiveRecord::Migration
  def change
    add_column :schools, :contact_status_id, :integer
  end
end
