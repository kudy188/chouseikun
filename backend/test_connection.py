import psycopg

def test_connection():
    try:
        conn = psycopg.connect("postgres://user_ymnqzvpkpf:YG0BV87tR7ElvXRLEjZP@devinapps-backend-prod.cluster-clussqewa0rh.us-west-2.rds.amazonaws.com/db_nlbisuxwgi?sslmode=require")
        print("Connection successful!")
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
