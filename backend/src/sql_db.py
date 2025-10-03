from .config import POSTGRES_CONFIG
from sqlalchemy import create_engine, inspect, or_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from .models import Base, Category, Keyword, Document
from typing import List

class SqlDB:
    def __init__(self):
        try:
            self.engine = create_engine(
                f"postgresql+psycopg2://{POSTGRES_CONFIG['user']}:{POSTGRES_CONFIG['password']}"
                f"@{POSTGRES_CONFIG['host']}:{POSTGRES_CONFIG['port']}/{POSTGRES_CONFIG['dbname']}",
                echo=False
            )
            self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
            inspector = inspect(self.engine)
            if not inspector.get_table_names():
                Base.metadata.create_all(bind=self.engine)
    
        except SQLAlchemyError as e:
            raise RuntimeError(f"Cannot connect to database: {e}")
            
    def get_session(self):
        return self.SessionLocal()

    def create_category(self, name: str):
        db = self.get_session()
        try:
            category = db.query(Category).filter_by(name=name).first()
            if category:
                return category
            category = Category(name=name)
            db.add(category)
            db.commit()
            db.refresh(category)
            return category
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()
    
    def get_category_by_name(self, name: str):
        db = self.get_session()
        try:
            return db.query(Category).filter_by(name=name).first()
        finally:
            db.close()
    
    def get_categories(self):
        db = self.get_session()
        try:
            return db.query(Category).all()
        finally:
            db.close()
    
    def get_category_by_id(self, id: int):
        db = self.get_session()
        try:
            return db.query(Category).filter_by(id=id).first()
        finally:
            db.close()

    def create_keyword(self, name: str):
        db = self.get_session()
        try:
            keyword = db.query(Keyword).filter_by(name=name).first()
            if keyword:
                return keyword
            keyword = Keyword(name=name)
            db.add(keyword)
            db.commit()
            db.refresh(keyword)
            return keyword
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()
    
    def get_keyword_by_name(self, name: str):
        db = self.get_session()
        try:
            return db.query(Keyword).filter_by(name=name).first()
        finally:
            db.close()
    
    def get_keywords(self):
        db = self.get_session()
        try:
            return db.query(Keyword).all()
        finally:
            db.close()

    def get_keyword_by_id(self, id: int):
        db = self.get_session()
        try:
            return db.query(Keyword).filter_by(id=id).first()
        finally:
            db.close()
    def get_keywords_by_ids(self, ids: List[int]):
        db = self.get_session()
        try:
            keywords = db.query(Keyword).filter(Keyword.id.in_(ids)).all()
            if len(keywords) != len(ids):
                return None
            return keywords
        finally:
            db.close()



    def create_document(
        self, 
        title: str, 
        summary: str, 
        link: str, 
        category_id: int,
        keyword_ids: List[int]
    ):
        db = self.get_session()
        try:
            category = db.query(Category).filter_by(id=category_id).first()
            if not category:
                return None

            keywords = db.query(Keyword).filter(Keyword.id.in_(keyword_ids)).all()
            if len(keywords) != len(keyword_ids):
                return None

            doc = Document(
                title=title,
                summary=summary,
                link=link,
                category=category,
                keywords=keywords
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)
            return doc
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()
        
    def get_documents_by_category(self, category_id: int):
        db = self.get_session()
        try:
            return db.query(Document).filter(Document.category_id == category_id).all()
        finally:
            db.close()
    
    def get_documents_by_ids(self, ids: List[int]):
        db = self.get_session()
        try:
            return db.query(Document).filter(Document.id.in_(ids)).all()
        finally:
            db.close()

    # --- Textual search helpers ---
    def search_documents_textual(self, query: str, limit: int = 10):
        """Perform simple textual search across title, summary, and keyword names.

        Uses case-insensitive substring matching (ILIKE) and returns up to `limit` documents.
        """
        db = self.get_session()
        try:
            # Normalize query and create patterns for token-based OR matching
            raw = (query or "").strip()
            if not raw:
                return []

            tokens = [t for t in raw.split() if t]
            patterns = [f"%{t}%" for t in tokens] or [f"%{raw}%"]

            title_filters = [Document.title.ilike(p) for p in patterns]
            summary_filters = [Document.summary.ilike(p) for p in patterns]
            keyword_filters = [Keyword.name.ilike(p) for p in patterns]

            clause = or_(
                or_(*title_filters),
                or_(*summary_filters),
                or_(*keyword_filters),
            )

            # Join to keywords so keyword name predicates work, but avoid duplicates via DISTINCT
            q = (
                db.query(Document)
                .outerjoin(Document.keywords)
                .filter(clause)
                .distinct(Document.id)
                .limit(limit)
            )
            return q.all()
        finally:
            db.close()
