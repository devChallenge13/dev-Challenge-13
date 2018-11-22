"""create_round_table

Revision ID: 2a45862446f5
Revises: 47caa8fa4536
Create Date: 2018-11-17 11:03:35.615934

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2a45862446f5'
down_revision = '47caa8fa4536'
branch_labels = None
depends_on = None


table_name = 'game'


def upgrade():
    op.create_table(
        table_name,
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tournament_id', sa.Integer, sa.ForeignKey('tournament.id')),
        sa.Column('round_id', sa.Integer),
        sa.Column('home_team_id', sa.Integer, sa.ForeignKey('team.id')),
        sa.Column('guest_team_id', sa.Integer, sa.ForeignKey('team.id')),
        sa.Column('home_team_result', sa.String),
    )
    op.create_index('team_tournament_id_home_team_id_guest_team_id',
                    table_name,
                    ['tournament_id', 'home_team_id', 'guest_team_id'],
                    unique=True)


def downgrade():
    op.drop_table(table_name)

