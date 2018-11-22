"""create_tournament_table

Revision ID: ad8594c89a92
Revises: 
Create Date: 2018-11-17 10:50:15.152467

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ad8594c89a92'
down_revision = None
branch_labels = None
depends_on = None

table_name = 'tournament'


def upgrade():
    op.create_table(
        table_name,
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(80), unique=True)
    )


def downgrade():
    op.drop_table(table_name)
