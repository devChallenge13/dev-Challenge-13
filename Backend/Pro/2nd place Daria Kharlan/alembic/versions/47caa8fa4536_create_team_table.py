"""create_team_table

Revision ID: 47caa8fa4536
Revises: ad8594c89a92
Create Date: 2018-11-17 10:59:25.097353

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '47caa8fa4536'
down_revision = 'ad8594c89a92'
branch_labels = None
depends_on = None


table_name = 'team'


def upgrade():
    op.create_table(
        table_name,
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tournament_id', sa.Integer, sa.ForeignKey('tournament.id')),
        sa.Column('name', sa.String(80))
    )
    op.create_index('team_tournament_id_name', table_name, ['tournament_id', 'name'], unique=True)


def downgrade():
    op.drop_table(table_name)
